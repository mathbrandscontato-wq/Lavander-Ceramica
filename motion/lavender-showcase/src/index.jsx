import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {LavenderShowcase} from './showcase.jsx';
const Root = () => (
  <Composition
    id="LavenderShowcase"
    component={LavenderShowcase}
    durationInFrames={605}
    fps={30}
    width={1080}
    height={1920}
  />
);
registerRoot(Root);
