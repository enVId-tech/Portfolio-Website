import React from 'react';
import particles from '../particles/particles.json';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';


const ParticlesElement: React.FC = (): JSX.Element => {
    const particlesInit = async (main: any): Promise<void> => {
        await loadFull(main);
    }

    return (
        <Particles id="tsparticles" options={particles as object} init={particlesInit}/>
    )
};

export default ParticlesElement;