import { coreDemos } from "./core";
import { dynamicsDemos } from "./dynamics";
import { modulationDemos } from "./modulation";
import { nonlinearDemos } from "./nonlinear";

export const dspDemos = { ...coreDemos, ...dynamicsDemos, ...modulationDemos, ...nonlinearDemos };
export const defaultDemoValues = (definition) => Object.fromEntries(definition.controls.map((control) => [control.key, control.defaultValue]));
