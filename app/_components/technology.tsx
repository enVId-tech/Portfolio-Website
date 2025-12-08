"use client";
import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from '@/styles/technology.module.scss';
import { M_400, M_600 } from "@/utils/globalFonts";
import { cachedFetch } from '@/utils/cache';

/**
 * Interface representing a technology.
 */
interface Tech {
    name: string;
    icon: React.ReactNode;
    proficiency: number;
    proficiencyLabel: string;
    usage: number;
}

/**
 * Props for the Technology component.
 */
type TechnologyProps = {
    children?: React.ReactNode;
}

interface TechResponse {
    icon: string | React.ReactNode;
    name: string;
    proficiency: number;
    proficiencyLabel: string;
    usage: number;
}

interface TechApiResponse {
    success: boolean;
    tech: TechResponse[];
}

// Cache for dynamically loaded icon libraries
const iconLibraryCache: { [key: string]: any } = {};

/**
 * Dynamically loads an icon library only when needed
 * @param libraryName - Name of the library to load (SI, FA, FA6, BS, VSC)
 * @returns Promise resolving to the icon library
 */
async function loadIconLibrary(libraryName: string): Promise<any> {
    // Return from cache if already loaded
    if (iconLibraryCache[libraryName]) {
        return iconLibraryCache[libraryName];
    }

    // Dynamically import the library based on its name
    let library;
    switch (libraryName) {
        case 'SI':
            library = await import('react-icons/si');
            break;
        case 'FA':
            library = await import('react-icons/fa');
            break;
        case 'FA6':
            library = await import('react-icons/fa6');
            break;
        case 'BS':
            library = await import('react-icons/bs');
            break;
        case 'VSC':
            library = await import('react-icons/vsc');
            break;
        default:
            throw new Error(`Unsupported icon library: ${libraryName}`);
    }

    // Cache the loaded library
    iconLibraryCache[libraryName] = library;
    return library;
}

type IconLibraryKey = 'SI' | 'FA' | 'FA6' | 'BS' | 'VSC';

/**
 * Converts a string representation of a React element into an actual React element.
 * Supports multiple icon libraries: SI, FA, FA6, BS, and VSC from react-icons.
 * Icons are dynamically imported only when needed.
 *
 * @param str - String representation of a React element
 * @returns Promise resolving to React element or null
 */
export async function stringToReactElement(str: string): Promise<React.ReactElement | null> {
    // Remove surrounding quotes if present
    const cleanStr = str.replace(/^["']|["']$/g, '');

    // First, try to parse as a full JSX-style element with tags
    const fullElementMatch = cleanStr.match(/<([^<>\s]+)(?:\.([^<>\s]+))?(?:\s+([^<>]+))?(?:\s*\/>|>(.*?)<\/\1(?:\.\2)?>)/);

    if (fullElementMatch) {
        const [, libraryOrComponent, possibleIcon, propsString = '', children = ''] = fullElementMatch;

        // If we have both library and component parts
        if (possibleIcon) {
            return await createIconElement(libraryOrComponent, possibleIcon, propsString, children);
        } else {
            // Handle single component name
            return await createIconElement(libraryOrComponent, undefined, propsString, children);
        }
    }

    // Next, try to match a library.component format without JSX tags
    const dotFormatMatch = cleanStr.match(/^([^<>\s.]+)\.([^<>\s.]+)(?:\s+(.+))?$/);

    if (dotFormatMatch) {
        const [, library, component, propsString = ''] = dotFormatMatch;
        return await createIconElement(library, component, propsString);
    }

    // Finally, try to parse as component name and props without tags
    const shorthandMatch = cleanStr.match(/^([^<>\s.]+)\s+(.+)$/);

    if (shorthandMatch) {
        const [, component, propsString] = shorthandMatch;
        return await createIconElement(component, undefined, propsString);
    }

    // If all else fails, it might be just a component name with no props
    if (/^[^<>\s.]+$/.test(cleanStr)) {
        return await createIconElement(cleanStr);
    }

    // Only log error if the string is not empty (empty strings are expected when icon is not a string)
    if (str && str.trim() !== '') {
        console.error('Invalid React element string format:', str);
    }
    return null;
}

/**
 * Helper function to create the React element from parsed parts.
 * Dynamically loads icon libraries as needed.
 */
async function createIconElement(
    libraryOrComponent: string,
    iconName?: string,
    propsString: string = '',
    children: string = ''
): Promise<React.ReactElement | null> {
    let component;

    if (iconName) {
        // Library and icon name are explicitly provided
        if (['SI', 'FA', 'FA6', 'BS', 'VSC'].includes(libraryOrComponent)) {
            try {
                const iconLibrary = await loadIconLibrary(libraryOrComponent);
                component = iconLibrary[iconName as keyof typeof iconLibrary];

                if (!component) {
                    console.error(`Icon ${iconName} not found in ${libraryOrComponent} library`);
                    return null;
                }
            } catch (error) {
                console.error(`Failed to load icon library ${libraryOrComponent}:`, error);
                return null;
            }
        } else {
            console.error(`Unsupported icon library: ${libraryOrComponent}`);
            return null;
        }
    } else {
        // First, check if the component contains a dot (which might indicate a library.component format)
        const dotParts = libraryOrComponent.split('.');
        if (dotParts.length === 2) {
            const [libName, compName] = dotParts;
            if (['SI', 'FA', 'FA6', 'BS', 'VSC'].includes(libName)) {
                try {
                    const iconLibrary = await loadIconLibrary(libName);
                    component = iconLibrary[compName as keyof typeof iconLibrary];
                    if (!component) {
                        console.error(`Icon ${compName} not found in ${libName} library`);
                        return null;
                    }
                } catch (error) {
                    console.error(`Failed to load icon library ${libName}:`, error);
                    return null;
                }
            } else {
                console.error(`Unsupported icon library: ${libName}`);
                return null;
            }
        } else {
            // Try to find the component in any library
            const libraryNames: IconLibraryKey[] = ['SI', 'FA', 'FA6', 'BS', 'VSC'];
            
            for (const libName of libraryNames) {
                try {
                    const lib = await loadIconLibrary(libName);
                    if (libraryOrComponent in lib) {
                        component = lib[libraryOrComponent as keyof typeof lib];
                        break;
                    }
                } catch (error) {
                    console.error(`Error checking library ${libName}:`, error);
                }
            }

            if (!component) {
                console.error(`Icon ${libraryOrComponent} not found in any library`);
                return null;
            }
        }
    }

    // Parse props
    const props: Record<string, unknown> = {};
    if (propsString) {
        const propMatches = propsString.matchAll(/(\w+)=(?:{([^{}]+)}|["']([^"']+)["'])/g);
        for (const match of propMatches) {
            const [, propName, jsValue, stringValue] = match;
            if (jsValue !== undefined) {
                try {
                    props[propName] = new Function(`return ${jsValue}`)();
                } catch (err) {
                    console.error(`Failed to parse JS value for prop ${propName}:`, err);
                }
            } else if (stringValue !== undefined) {
                props[propName] = stringValue;
            }
        }
    }

    // Create the element
    return React.createElement(component, props, children || null);
}

/**
 * Technology component to display a list of technologies with their proficiency and usage.
 * @param {TechnologyProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered Technology component.
 */
export default function Technology({ children }: TechnologyProps): React.ReactElement {
    const [visibleTechs, setVisibleTechs] = useState<{ [key: string]: boolean }>({});
    const [techData, setTechData] = useState<Tech[]>([]);
    const techRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const fetchTechData = useCallback(async () => {
        try {
            const data = await cachedFetch(
                '/api/tech',
                'api-tech',
                { headers: { 'Cache-Control': 'public, max-age=1200' } },
                20 * 60 * 1000 // 20 minutes cache - aggressive caching
            ) as TechApiResponse;

            if (data && data.success) {
                // Convert string icons to React elements using dynamic imports
                const processedTech = await Promise.all(
                    data.tech.map(async (tech: TechResponse) => ({
                        ...tech,
                        icon: typeof tech.icon === "string" 
                            ? await stringToReactElement(tech.icon) 
                            : tech.icon
                    }))
                );

                setTechData(processedTech);
            }
        } catch (err) {
            console.error('Failed to fetch tech data:', err);
        }
    }, []);

    useEffect(() => {
        // Initial fetch when component mounts
        fetchTechData();

        // Set up interval for periodic fetching (every 10 minutes for aggressive caching)
        const interval = setInterval(fetchTechData, 10 * 60 * 1000);

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, [fetchTechData]);


    /**
     * Effect to observe the visibility of technology elements and update state accordingly.
     */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const tech = entry.target.getAttribute('data-tech');
                        if (tech) {
                            setVisibleTechs(prev => ({ ...prev, [tech]: true }));
                        }
                    }
                });
            },
            { threshold: 0.2 }
        );

        techData.forEach(tech => {
            if (techRefs.current[tech.name]) {
                observer.observe(techRefs.current[tech.name]!);
            }
        });

        return () => observer.disconnect();
    }, [techData]);

    return (
        <div className={styles.container} id={"technology"}>
            <h2 className={`${styles.techTitle} ${M_600}`}>Technology Stack</h2>

            <div className={styles.techGrid}>
                {techData.map(tech => (
                    <div key={tech.name}
                         ref={el => { techRefs.current[tech.name] = el; }}
                         data-tech={tech.name}
                         className={`${styles.techCard} ${visibleTechs[tech.name] ? styles.visible : ''}`}>
                        <div className={styles.logoContainer}>
                            {tech.icon}
                        </div>
                        <h3 className={`${styles.techName} ${M_600}`}>{tech.name}</h3>

                        <div className={styles.proficiencyContainer}>
                            <span className={`${styles.proficiencyLabel} ${M_400}`}>{tech.proficiencyLabel}</span>
                            <div className={styles.proficiencyBar}>
                                <div className={styles.proficiencyFill} style={{width: `${tech.proficiency * 20}%`}}/>
                            </div>
                        </div>

                        <div className={styles.usageContainer}>
                            <span className={`${styles.usageLabel} ${M_400}`}>Usage</span>
                            <div className={styles.usageBar}>
                                <div className={styles.usageFill} style={{width: `${tech.usage}%`}}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            { children }
        </div>
    );
}