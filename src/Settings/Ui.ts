import { IGameStartrSettings } from "gamestartr/lib/IGameStartr";
import { IMod, IMods } from "modattachr/lib/IModAttachr";
import { IOptionsButtonSchema } from "userwrappr/lib/Generators/ButtonsGenerator";
import { ISchema } from "userwrappr/lib/UISchemas";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IUserWrapprSettings } from "../IFullScreenPokemon";

export function GenerateUISettings(): IUserWrapprSettings {
    "use strict";

    return {
        GameStartrConstructor: (settings: IGameStartrSettings): FullScreenPokemon => {
            return new FullScreenPokemon(settings);
        },
        globalName: "FSP",
        styleSheet: {
            ".FullScreenPokemon": {
                color: "black"
            },
            "@font-face": {
                "font-family": "'Press Start'",
                src: [
                    "url('Fonts/pressstart2p-webfont.eot?#iefix') format('embedded-opentype')",
                    "url('Fonts/pressstart2p-webfont.woff') format('woff')",
                    "url('Fonts/pressstart2p-webfont.ttf') format('truetype')",
                    "url('Fonts/pressstart2p-webfont.svg') format('svg')"
                ].join(", "),
                "font-weight": "normal",
                "font-style": "normal"
            }
        },
        sizeDefault: "Wide",
        sizes: {
            GameBoy: {
                width: 320,
                height: 288
            },
            NES: {
                width: 512,
                height: 464,
                full: false
            },
            Wide: {
                width: Infinity,
                height: 580,
                full: false
            },
            Large: {
                width: Infinity,
                height: Infinity,
                full: false
            },
            "Full!": {
                width: Infinity,
                height: Infinity,
                full: true
            }
        },
        schemas: [
            {
                title: "Options",
                generator: "OptionsTable",
                options: [
                    {
                        title: "Volume",
                        type: "Number",
                        minimum: 0,
                        maximum: 100,
                        source: (FSP: FullScreenPokemon): number => {
                            return Math.round(FSP.AudioPlayer.getVolume() * 100);
                        },
                        update: (FSP: FullScreenPokemon, value: number): void => {
                            FSP.AudioPlayer.setVolume(value / 100);
                        }
                    },
                    {
                        title: "Mute",
                        type: "Boolean",
                        source: (FSP: FullScreenPokemon): boolean => {
                            return FSP.AudioPlayer.getMuted();
                        },
                        enable: (FSP: FullScreenPokemon): void => {
                            FSP.AudioPlayer.setMutedOn();
                        },
                        disable: (FSP: FullScreenPokemon): void => {
                            FSP.AudioPlayer.setMutedOff();
                        }
                    },
                    {
                        title: "Speed",
                        type: "Select",
                        options: (): string[] => {
                            return [".25x", ".5x", "1x", "2x", "5x"];
                        },
                        source: (): string => {
                            return "1x";
                        },
                        update: (FSP: FullScreenPokemon, value: string): void => {
                            FSP.GamesRunner.setSpeed(Number(value.replace("x", "")));
                        },
                        storeLocally: true
                    },
                    {
                        title: "View Mode",
                        type: "ScreenSize"
                    },
                    {
                        title: "Framerate",
                        type: "Select",
                        options: () : string[] => {
                            return ["60fps", "30fps"];
                        },
                        source: (FSP: FullScreenPokemon): string => {
                            return (1 / FSP.PixelDrawer.getFramerateSkip() * 60) + "fps";
                        },
                        update: (FSP: FullScreenPokemon, value: string): void => {
                            let numeric: number = parseInt(value.replace("fps", ""), 10);
                            FSP.PixelDrawer.setFramerateSkip(1 / numeric * 60);
                        },
                        storeLocally: true
                    },
                    {
                        title: "Tilt Controls",
                        type: "Boolean",
                        storeLocally: true,
                        source: (): boolean => {
                            return false;
                        },
                        enable: (FSP: FullScreenPokemon): void => {
                            window.ondevicemotion = FSP.InputWriter.makePipe("ondevicemotion", "type") as any;
                        },
                        disable: (): void => {
                            window.ondevicemotion = undefined!;
                        }
                    }
                ],
                actions: [
                    {
                        title: "Screenshot",
                        action: (FSP: FullScreenPokemon): void => {
                            FSP.utilities.takeScreenshot(`FullScreenPokemon ${Date.now()}`);
                        }
                    }
                ]
            },
            {
                title: "Controls",
                generator: "OptionsTable",
                options: ((controls: string[]): IOptionsButtonSchema[] => {
                    return controls.map((title: string): IOptionsButtonSchema => {
                        return {
                            title: title[0].toUpperCase() + title.substr(1),
                            type: "Keys",
                            storeLocally: true,
                            source: (FSP: FullScreenPokemon): string[] => {
                                return FSP.InputWriter
                                    .getAliasAsKeyStrings(title)
                                    .map((text: string): string => text.toLowerCase());
                            },
                            callback: (FSP: FullScreenPokemon, valueOld: string, valueNew: string): void => {
                                FSP.InputWriter.switchAliasValues(
                                    title,
                                    [FSP.InputWriter.convertKeyStringToAlias(valueOld)],
                                    [FSP.InputWriter.convertKeyStringToAlias(valueNew)]
                                );
                            }
                        };
                    });
                })(["a", "b", "left", "right", "up", "down", "pause"])
            }, {
                title: "Mods!",
                generator: "OptionsButtons",
                keyActive: "enabled",
                assumeInactive: true,
                options: (FSP: FullScreenPokemon): IOptionsButtonSchema[] => {
                    const mods: IMods = FSP.ModAttacher.getMods();
                    const output: IOptionsButtonSchema[] = [];
                    let mod: IMod;

                    for (let i in mods) {
                        if (!mods.hasOwnProperty(i)) {
                            continue;
                        }

                        mod = mods[i];

                        output.push({
                            title: mod.name,
                            source: (): boolean => !!mod.enabled,
                            storeLocally: true,
                            type: "text"
                        });
                    }

                    return output;
                },
                callback: (FSP: FullScreenPokemon, _schema: ISchema, button: HTMLElement): void => {
                    const name: string = button.textContent!;
                    const key: string = button.getAttribute("localStorageKey")!;
                    const mod: IMod = FSP.ModAttacher.getMod(name);

                    FSP.ModAttacher.toggleMod(name);
                    FSP.ItemsHolder.setItem(key, mod.enabled);
                    FSP.ItemsHolder.saveItem(key);
                }
            }
        ]
    } as any;
}
