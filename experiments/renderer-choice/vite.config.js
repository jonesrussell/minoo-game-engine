import {defineConfig} from 'vite';
export default defineConfig(({mode})=>({define:{'import.meta.env.VITE_RENDERER':JSON.stringify(['pixi','phaser'].includes(mode)?mode:'')}}));
