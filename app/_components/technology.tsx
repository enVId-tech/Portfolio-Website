"use client";
import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from '@/styles/technology.module.scss';
import { M_400, M_600 } from "@/utils/globalFonts";
import { cachedFetch } from '@/utils/cache';

// Import tech icons
import * as FA from 'react-icons/fa';
import * as SI from 'react-icons/si';
import * as FA6 from "react-icons/fa6";
import * as BS from "react-icons/bs";
import * as VSC from "react-icons/vsc";

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

// Map of supported icon libraries
const ICON_LIBRARIES = {
    SI,
    FA,
    FA6,
    BS,
    VSC
};

type IconLibraryKey = keyof typeof ICON_LIBRARIES;

/**
 * Converts a string representation of a React element into an actual React element.
 * Supports multiple icon libraries: SI, FA, FA6, BS, and VSC from react-icons.
 *
 * @param str - String representation of a React element
 * @returns React element
 */
export function stringToReactElement(str: string): React.ReactElement | null {
    // Remove surrounding quotes if present
    const cleanStr = str.replace(/^["']|["']$/g, '');

    // First, try to parse as a full JSX-style element with tags
    const fullElementMatch = cleanStr.match(/<([^<>\s]+)(?:\.([^<>\s]+))?(?:\s+([^<>]+))?(?:\s*\/>|>(.*?)<\/\1(?:\.\2)?>)/);

    if (fullElementMatch) {
        const [, libraryOrComponent, possibleIcon, propsString = '', children = ''] = fullElementMatch;

        // If we have both library and component parts
        if (possibleIcon) {
            return createIconElement(libraryOrComponent, possibleIcon, propsString, children);
        } else {
            // Handle single component name
            return createIconElement(libraryOrComponent, undefined, propsString, children);
        }
    }

    // Next, try to match a library.component format without JSX tags
    const dotFormatMatch = cleanStr.match(/^([^<>\s.]+)\.([^<>\s.]+)(?:\s+(.+))?$/);

    if (dotFormatMatch) {
        const [, library, component, propsString = ''] = dotFormatMatch;
        return createIconElement(library, component, propsString);
    }

    // Finally, try to parse as component name and props without tags
    const shorthandMatch = cleanStr.match(/^([^<>\s.]+)\s+(.+)$/);

    if (shorthandMatch) {
        const [, component, propsString] = shorthandMatch;
        return createIconElement(component, undefined, propsString);
    }

    // If all else fails, it might be just a component name with no props
    if (/^[^<>\s.]+$/.test(cleanStr)) {
        return createIconElement(cleanStr);
    }

    console.error('Invalid React element string format:', str);
    return null;
}

/**
 * Helper function to create the React element from parsed parts
 */
function createIconElement(
    libraryOrComponent: string,
    iconName?: string,
    propsString: string = '',
    children: string = ''
): React.ReactElement | null {
    let component;

    if (iconName) {
        if (libraryOrComponent in ICON_LIBRARIES) {
            const iconLibrary = ICON_LIBRARIES[libraryOrComponent as IconLibraryKey];
            component = iconLibrary[iconName as keyof typeof iconLibrary];

            if (!component) {
                console.error(`Icon ${iconName} not found in ${libraryOrComponent} library`);
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
            if (libName in ICON_LIBRARIES) {
                const iconLibrary = ICON_LIBRARIES[libName as IconLibraryKey];
                component = iconLibrary[compName as keyof typeof iconLibrary];
                if (!component) {
                    console.error(`Icon ${compName} not found in ${libName} library`);
                    return null;
                }
            } else {
                console.error(`Unsupported icon library: ${libName}`);
                return null;
            }
        } else {
            // Try to find the component in any library
            for (const [, lib] of Object.entries(ICON_LIBRARIES)) {
                if (libraryOrComponent in lib) {
                    component = lib[libraryOrComponent as keyof typeof lib];
                    break;
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
                { headers: { 'Cache-Control': 'no-cache' } },
                5 * 60 * 1000 // 5 minutes cache
            ) as TechApiResponse;

            if (data && data.success) {
                // Convert string icons to React elements
                data.tech = data.tech.map((tech: TechResponse) => ({
                    ...tech,
                    icon: stringToReactElement(typeof tech.icon === "string" ? tech.icon : '')
                }));

                setTechData(data.tech);
            }
        } catch (err) {
            console.error('Failed to fetch tech data:', err);
        }
    }, []);

    useEffect(() => {
        // Initial fetch when component mounts
        fetchTechData();

        // Set up interval for periodic fetching (once per minute)
        const interval = setInterval(fetchTechData, 60000);

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