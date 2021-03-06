import * as ibattlemovr from "battlemovr/lib/IBattleMovr";
import * as igamestartr from "gamestartr/lib/IGameStartr";
import * as imapscreatr from "mapscreatr/lib/IMapsCreatr";
import { IPreThing as IMapsCreatrIPreThing } from "mapscreatr/lib/IPreThing";
import * as imapscreenr from "mapscreenr/lib/IMapScreenr";
import * as imathdecidr from "mathdecidr/lib/IMathDecidr";
import * as imenugraphr from "menugraphr/lib/IMenuGraphr";
import * as inumbermakr from "numbermakr/lib/INumberMakr";
import * as itimehandlr from "timehandlr/lib/ITimeHandlr";
import * as iuserwrappr from "userwrappr/lib/IUserWrappr";

/**
 * Container for holding the states of objects in the game.
 */
export interface IStateHistory {
    [i: string]: [any];
}

/**
 * An object for saving this object's state history.
 */
export interface IStateSaveable {
    /**
     * Holds the states of an object in the game.
     */
    state: IStateHistory;
}

/**
 * A simple container for Map attributes given by switching to an Area within 
 * that map. A bounding box of the current viewport is kept, along with a bag
 * of assorted variable values.
 */
export interface IMapScreenr extends imapscreenr.IMapScreenr {
    /**
     * Whether user inputs should be ignored.
     */
    blockInputs: boolean;

    /**
     * The currently playing cutscene, if any.
     */
    cutscene?: string;

    /**
     * What direction the player is currently facing.
     */
    playerDirection: number;

    /**
     * What theme is currently playing.
     */
    theme?: string;

    /**
     * Known variables, keyed by name.
     */
    variables: {
        /**
         * Whether the current Area allows bicycling.
         */
        allowCycling?: boolean;

        /**
         * The current size of the area Things are placed in.
         */
        boundaries: IAreaBoundaries;

        /**
         * What form of scrolling is currently capable on the screen.
         */
        scrollability: number;
    };
}

/**
 * Things keyed by their ids.
 */
export interface IThingsById {
    [i: string]: IThing;
}

/**
 * Settings regarding in-game battles, particularly for an IBattleMovr.
 */
export interface IBattlesModuleSettings extends ibattlemovr.IBattleMovrSettings, igamestartr.IModuleSettingsObject { }

/**
 * Settings regarding the level editor, particularly for an ILevelEditr.
 */
export interface ILevelEditrCustoms extends igamestartr.IModuleSettingsObject { }

/**
 * Settings regarding computations, particularly for an IMathDecidr.
 */
export interface IMathModuleSettings extends igamestartr.IMathModuleSettings {
    /**
     * Constants the IMathDecidr may use in equations.
     */
    constants: IStaticMathConstants;

    /**
     * Calculation Functions, keyed by name.
     */
    equations: IMathEquations;
}

/**
 * 
 */
export interface IStaticMathConstants extends imathdecidr.IConstants {
    /**
     * Names of all statistics Pokemon have.
     */
    statisticNames: string[];

    /**
     * Names of Pokemon statistics to display in statistics menus.
     */
    statisticNamesDisplayed: string[];

    /**
     * How much to expand each pixel from raw sizing measurements to in-game.
     */
    unitsize: number;

    /**
     * Information on Pokemon status effects.
     */
    statuses: {
        /**
         * Names of all statuses Pokemon may have.
         */
        names: string[];

        /**
         * Statuses that will enable a Pokemon to be caught in the canCatchPokemon
         * equation if a random generated N is < 25.
         */
        probability25: {
            [i: string]: boolean;
        };

        /**
         * Statuses that will enable a Pokemon to be caught in the canCatchPokemon
         * equation if a random generated N is < 21.
         */
        probability12: {
            [i: string]: boolean;
        };

        /**
         * Bonus probability points awarded for statuses in the canCatchPokemon equation
         * against the random generated N.
         */
        levels: {
            [i: string]: number;
        };

        /**
         * Additional shake points (s) in the numBallShakes equation for each status.
         */
        shaking: {
            [i: string]: number;
        }
    };

    /**
     * [X, Y] coordinates for spots on the Town Map to display Thing icons.
     */
    townMapLocations: {
        [i: string]: [number, number];
    };

    /**
     * Information on Pokemon types.
     */
    types: {
        /**
         * Names of types Pokemon may be.
         */
        names: string[];

        /**
         * Type names mapped to their location in the type effectiveness table.
         */
        indices: {
            [i: string]: number;
        };

        /**
         * The type effectiveness table, mapping each [attacker, defender] type
         * effectiveness multiplier.
         */
        table: number[][];
    };

    /**
     * All known Pokemon, keyed by concatenated name.
     */
    pokemon: {
        [i: string]: IPokemonListing;
    };

    /**
     * All known Pokemon moves, keyed by concatenated name.
     */
    moves: {
        [i: string]: IMoveSchema;
    };

    /**
     * All known items, keyed by concatenated name.
     */
    items: {
        [i: string]: IItemSchema;
    };

    /**
     * Battle modifications used in the opponentMove equation.
     */
    battleModifications: {
        [i: string]: IBattleModification;
    };
}

/**
 * Constants for an IMathDecidr, including all static Pokemon information.
 */
export interface IMathConstants extends IStaticMathConstants {
    /**
     * Generates random numbers for math equations.
     */
    NumberMaker: inumbermakr.INumberMakr;
}

/**
 * Calculation Functions for an IMathDecidr, keyed by name.
 */
export interface IMathEquations extends imathdecidr.IEquations {
    /**
     * Generates a new Pokemon with the given traits.
     * 
     * @param title   The type of Pokemon to create.
     * @param level   The level of the new Pokemon (by default, 1).
     * @param moves   What moves the Pokemon has (by default, generated from its type
     *                and level).
     * @param iv   What IV points the Pokemon should start with (by default, generated 
     *             from the newPokemonIVs equation.
     * @param ev   What EV points the Pokemon should start with (by default, generated
     *             from the newPokemonEVs equation).
     * @returns A newly created Pokemon.
     */
    newPokemon: (
        this: imathdecidr.IMathDecidr,
        title: string[],
        level?: number,
        moves?: ibattlemovr.IMove[],
        iv?: number,
        ev?: number) => IPokemon;

    /**
     * Computes the default new moves for a Pokemon based on its type and level.
     * 
     * @param title   The type of Pokemon.
     * @param level   The level of the Pokemon.
     * @returns The default moves of the Pokemon.
     */
    newPokemonMoves: (this: imathdecidr.IMathDecidr, title: string[], level: number) => ibattlemovr.IMove[];

    /**
     * Computes a random set of IV points for a new Pokemon.
     * 
     * @returns A random set of IV points.
     */
    newPokemonIVs: (this: imathdecidr.IMathDecidr) => { [i: string]: number };

    /**
     * Computes a blank set of EV points for a new Pokemon.
     * 
     * @returns A blank set of EV points.
     */
    newPokemonEVs: (this: imathdecidr.IMathDecidr) => { [i: string]: number };

    /**
     * Computes how much experience a new Pokemon should start with, based on its
     * type and level.
     * 
     * @param title   The type of Pokemon.
     * @param level   The level of the Pokemon.
     * @returns How much experience the Pokemon should start with.
     */
    newPokemonExperience: (this: imathdecidr.IMathDecidr, title: string[], level: number) => ibattlemovr.IActorExperience;

    /**
     * Computes a Pokemon's new statistic based on its IVs and EVs.
     * 
     * @param statistic   Which statistic to compute.
     * @returns A new value for the statistic.
     */
    pokemonStatistic: (this: imathdecidr.IMathDecidr, pokemon: IPokemon, statistic: string) => number;

    /**
     * Determines whether a wild encounter should occur when walking through grass.
     * 
     * @param grass   The grass Thing being walked through.
     * @returns Whether a wild encounter should occur.
     */
    doesGrassEncounterHappen: (this: imathdecidr.IMathDecidr, grass: IGrass) => boolean;

    /**
     * Determines whether a Pokemon may be caught by a ball.
     * 
     * @param pokemon   The Pokemon the ball is attempting to catch.
     * @param ball   The ball attempting to catch the Pokemon.
     * @returns Whether the Pokemon may be caught.
     */
    canCatchPokemon: (this: imathdecidr.IMathDecidr, pokemon: IPokemon, ball: IBattleBall) => boolean;

    /**
     * Determines whether the player may flee a wild Pokemon encounter.
     * 
     * @param pokemon   The player's current Pokemon.
     * @param enemy   The wild Pokemon.
     * @param battleInfo   Information on the current battle.
     * @returns Whether the player may flee.
     */
    canEscapePokemon: (this: imathdecidr.IMathDecidr, pokemon: IPokemon, enemy: IPokemon, battleInfo: IBattleInfo) => boolean;

    /**
     * Calculates how many times a failed Pokeball should shake.
     * 
     * @param pokemon   The wild Pokemon the ball is failing to catch.
     * @param ball   The Pokeball attempting to catch the wild Pokemon.
     * @returns How many times the balls hould shake.
     */
    numBallShakes: (this: imathdecidr.IMathDecidr, pokemon: IPokemon, ball: IBattleBall) => number;

    /**
     * Determines what move an opponent should take in battle.
     * 
     * @param player   The in-battle player.
     * @param opponent   The in-battle opponent.
     * @returns The contatenated name of the move the opponent will choose.
     */
    opponentMove: (
        this: imathdecidr.IMathDecidr,
        player: IBattler,
        opponent: IBattler) => string;

    /**
     * Checks whether a Pokemon contains any of the given types.
     * 
     * @param pokemon   A Pokemon.
     * @param types   The types to check.
     * @returns Whether the Pokemon's types includes any of the given types.
     */
    pokemonMatchesTypes: (this: imathdecidr.IMathDecidr, pokemon: IPokemon, types: string[]) => boolean;

    /**
     * Checks whether a move only has a status effect (does no damage, or nothing).
     * 
     * @param move   The move.
     * @returns Whether the moves has only a status effect.
     */
    moveOnlyStatuses: (this: imathdecidr.IMathDecidr, move: IMoveSchema) => boolean;

    /**
     * Modifies a move possibility's priority based on battle state.
     * 
     * @param possibility   A move possibility.
     * @param modification   A modification summary for a part of the battle state.
     * @param target   The Pokemon being targeted.
     * @param amount   How much to modify the move's priority.
     */
    applyMoveEffectPriority: (possibility: IMovePossibility, modification: IBattleModification, target: IPokemon, amount: number) => void;

    /**
     * Determines whether a player's Pokemon should move before the opponent's.
     * 
     * @param player   The in-battle player.
     * @param choicePlayer   The concatenated name of the move the player chose.
     * @param opponent   The in-battle opponent.
     * @param choiesOpponent   The concatenated name of the move the opponent chose.
     * @returns Whether the player will move before the opponent.
     */
    playerMovesFirst: (player: IBattler, choicePlayer: string, opponent: IBattler, choiceOpponent: string) => boolean;

    /**
     * Computes how much damage a move should do to a Pokemon.
     * 
     * @param move   The concatenated name of the move.
     * @param attacker   The attacking pokemon.
     * @param defender   The defending Pokemon.
     * @returns How much damage should be dealt.
     */
    damage: (this: imathdecidr.IMathDecidr, move: string, attacker: IPokemon, defender: IPokemon) => number;

    /**
     * Determines the damage modifier against a defending Pokemon.
     * 
     * @param move   The attacking Pokemon's move.
     * @param attacker   The attacking Pokemon.
     * @param defender   The defending Pokemon.
     * @returns The damage modifier, as a multiplication constant.
     */
    damageModifier: (move: IMoveSchema, attacker: IPokemon, defender: IPokemon) => number;

    /**
     * Determines whether a move should be a critical hit.
     * 
     * @param move   The concatenated name of the move.
     * @param attacker   The attacking Pokemon.
     * @returns Whether the move should be a critical hit.
     */
    criticalHit: (this: imathdecidr.IMathDecidr, move: string, attacker: IPokemon) => boolean;

    /**
     * Determines the type effectiveness of a move on a defending Pokemon.
     * 
     * @param move   The concatenated name of the move.
     * @param defender   The defending Pokemon.
     * @returns A damage modifier, as a multiplication constant.
     */
    typeEffectiveness: (this: imathdecidr.IMathDecidr, move: string, defender: IPokemon) => number;

    /**
     * Computes how much experience a new Pokemon should start with.
     * 
     * @param title   The name of the Pokemon.
     * @param level   The level of the Pokemon.
     * @returns An amount of experience.
     */
    experienceStarting: (this: imathdecidr.IMathDecidr, title: string[], level: number) => number;

    /**
     * Computes how much experience should be gained from defeating a Pokemon.
     * 
     * @returns How much experience is to be gained.
     * @remarks This will need to be changed to accomodate rewarding multiple Pokemon.
     */
    experienceGained: (this: imathdecidr.IMathDecidr, player: IBattler, opponent: IBattler) => number;

    /**
     * Computes how wide a health bar should be.
     * 
     * @param widthFullBar   The maximum possible width.
     * @param hp   How much HP a Pokemon currently has.
     * @param hpNormal   The maximum HP the Pokemon may have.
     * @returns How wide the health bar should be.
     */
    widthHealthBar: (widthFullBar: number, hp: number, hpNormal: number) => number;
}

/**
 * FullScreenPokemon-specific IMathDecidr usage.
 */
export interface IFullScreenPokemonMathDecidr extends imathdecidr.IMathDecidr {
    /**
     * Useful constants the IMathDecidr may use in equations.
     */
    readonly constants: IMathConstants;
    /**
     * Stored equations bound to the IMathDecidr.
     */
    readonly equations: IMathEquations;
}

/**
 * Settings regarding maps, particularly for AreaSpawnr, MapScreenr,
 * and MapsCreatr.
 */
export interface IMapsModuleSettings extends igamestartr.IMapsModuleSettings {
    /**
     * Known maps, keyed by name.
     */
    library: {
        [i: string]: IMapRaw;
    };
}

/**
 * Settings regarding a menu system, particularly for an IMenuGraphr.
 */
export interface IMenusModuleSettings extends igamestartr.IModuleSettingsObject {
    /**
     * Known menu schemas, keyed by name.
     */
    schemas: imenugraphr.IMenuSchemas;

    /**
     * Alternate titles for texts, such as " " to "space".
     */
    aliases: imenugraphr.IAliases;

    /**
     * Programmatic replacements for deliniated words.
     */
    replacements: imenugraphr.IReplacements;
}

/**
 * Settings regarding large-scale state storage, particularly for an IStateHoldr.
 */
export interface IStateModuleSettings extends igamestartr.IModuleSettingsObject {
    /**
     * A prefix to prepend keys for the ItemsHolder.
     */
    prefix?: string;
}

/**
 * Settings regarding the UI, particularly for an IUserWrappr.
 */
export interface IUserWrapprSettings extends igamestartr.IModuleSettingsObject, iuserwrappr.IUserWrapprSettings {}

/**
 * Stored settings to generate modules.
 */
export interface IModuleSettings extends igamestartr.IModuleSettings {
    /**
     * Settings regarding in-game battles, particularly for an IBattleMovr.
     */
    battles: IBattlesModuleSettings;

    /**
     * Settings regarding computations, particularly for an IMathDecidr.
     */
    math: IMathModuleSettings;

    /**
     * Settings regarding maps, particularly for an IAreaSpawnr, an
     * IMapScreenr, and an IMapsCreatr.
     */
    maps: IMapsModuleSettings;

    /**
     * Settings regarding a menu system, particularly for an IMenuGraphr.
     */
    menus: IMenusModuleSettings;

    /**
     * Settings regarding large-scale state storage, particularly for an IStateHoldr.
     */
    state: IStateModuleSettings;

    /**
     * Settings regarding front-facing UI.
     */
    ui: IUserWrapprSettings;
}

/**
 * Static information about a known Pokemon.
 */
export interface IPokemonListing {
    /**
     * The height of the Pokemon, as ["feet", "inches"].
     */
    height: [string, string];

    /**
     * A short label for the Pokemon, such as "Psi" for Abra.
     */
    label: string;

    /**
     * What number the Pokemon is in the Pokedex.
     */
    number: number;

    /**
     * The type of sprite used in-game for this Pokemon, such as "Water".
     */
    sprite: string;

    /**
     * Lines of text describing the Pokemon.
     */
    info: string[];

    /**
     * The name of the Pokemon this evolves into. This will be refactored eventually.
     */
    evolvesInto?: string;

    /**
     * How this Pokemon evolves. This will be refactored eventually.
     */
    evolvesVia?: string;

    /**
     * How quickly this gains experience, as "slow", "mediumSlow", "mediumFast", or "fast".
     */
    experienceType?: string; // Todo: once all are known, make non-optional

    /**
     * How much this weighs.
     */
    weight: number;

    /**
     * This Pokemons 1 or 2 types.
     */
    types: string[];

    /**
     * The rate of HP statistic growth.
     */
    HP: number;

    /**
     * The rate of Attack statistic growth.
     */
    Attack: number;

    /**
     * The rate of Defense statistic growth.
     */
    Defense: number;

    /**
     * The rate of Special statistic growth.
     */
    Special: number;

    /**
     * The rate of HP statistic growth.
     */
    Speed: number;

    /**
     * Known moves this Pokemon may learn.
     */
    moves: IPokemonMovesListing;
}

/**
 * A description of a Pokemon in a player's Pokedex.
 * @todo It's not clear how this is different from IPokedexInformation.
 */
export interface IPokedexListing extends IPokemonListing {
    /**
     * Whether the Pokemon has been caught.
     */
    caught?: boolean;

    /**
     * Whether the Pokemon has been seen.
     */
    seen?: boolean;

    /**
     * The concatenated title of the Pokemon.
     */
    title: string;
}

/**
 * A description of a Pokemon in a player's Pokedex.
 * @todo It's not clear how this is different from IPokedexListing.
 */
export interface IPokedexInformation {
    /**
     * Whether the Pokemon has been caught.
     */
    caught?: boolean;

    /**
     * Whether the Pokemon has been seen.
     */
    seen?: boolean;

    /**
     * The title of the Pokemon.
     */
    title: string[];
}

/**
 * A player's Pokedex, as a summary of seen Pokemon keyed by name.
 */
export interface IPokedex {
    [i: string]: IPokedexInformation;
}

/**
 * Moves able to be learned by a Pokemon via different methods.
 */
export interface IPokemonMovesListing {
    /**
     * Moves a Pokemon may learn by leveling up.
     */
    natural: IPokemonMoveListing[];

    /**
     * Moves a Pokemon may learn by HM.
     */
    hm: IPokemonMoveListing[];

    /**
     * Moves a Pokemon may learn by TM.
     */
    tm: IPokemonMoveListing[];
}

/**
 * A description of a move a Pokemon may learn.
 */
export interface IPokemonMoveListing {
    /**
     * The concatenated title of the move.
     */
    move: string;

    /**
     * What level the move may be learned, if by leveling up.
     */
    level?: number;
}

/**
 * A general description of a save file.
 */
export interface ISaveFile {
    [i: string]: any;
}

/**
 * 
 */
export interface IMapRaw extends imapscreatr.IMapRaw {
    /**
     * A listing of areas in the Map, keyed by name.
     */
    areas: {
        [i: string]: IAreaRaw;
        [i: number]: IAreaRaw;
    };

    /**
     * The default location for the Map.
     */
    locationDefault: string;

    /**
     * Descriptions of locations in the map.
     */
    locations: {
        [i: string]: ILocationRaw;
        [i: number]: ILocationRaw;
    };

    /**
     * A starting seed to initialize random number generation.
     */
    seed?: number | number[];

    /**
     * What theme to play by default, such as "Pallet Town".
     */
    theme?: string;
}

/**
 * A Map parsed from its raw JSON-friendly description.
 */
export interface IMap extends IStateSaveable, imapscreatr.IMap {
    /**
     * A listing of areas in the Map, keyed by name.
     */
    areas: {
        [i: string]: IArea;
        [i: number]: IArea;
    };

    /**
     * The name of the Map, such as "Pallet Town".
     */
    name: string;

    /**
     * The default location for the Map.
     */
    locationDefault?: string;

    /**
     * A starting seed to initialize random number generation.
     */
    seed: number | number[];

    /**
     * What theme to play by default, such as "Pallet Town".
     */
    theme: string;
}

/**
 * 
 */
export interface IAreaRaw extends imapscreatr.IAreaRaw {
    /**
     * Whether the Area allows bicycling.
     */
    allowCycling?: boolean;

    /**
     * Any additional attributes that should add extra properties to this Area.
     */
    attributes?: {
        [i: string]: any;
    };

    /**
     * What background to display behind all Things.
     */
    background?: string;

    /**
     * How tall the area is.
     * @todo It's not clear if this is different from boundaries.height.
     */
    height?: number;

    /**
     * Whether the area should have invisible borders added around it.
     */
    invisibleWallBorders?: boolean;

    /**
     * A default theme to override the parent Map's.
     */
    theme?: string;

    /**
     * How wide the area is.
     * @todo It's not clear if this is different from boundaries.width.
     */
    width?: number;

    /**
     * Wild Pokemon that may appear in this Area.
     */
    wildPokemon?: IAreaWildPokemonOptionGroups;
}

/**
 * An Area parsed from a raw JSON-friendly Map description.
 */
export interface IArea extends IAreaRaw, IStateSaveable, imapscreatr.IArea {
    /**
     * Whether the Area allows bicycling.
     */
    allowCycling: boolean;

    /**
     * What background to display behind all Things.
     */
    background: string;

    /**
     * In-game boundaries of all placed Things.
     */
    boundaries: IAreaBoundaries;

    /**
     * The Map this Area is within.
     */
    map: IMap;

    /**
     * Whether this Area has been spawned.
     */
    spawned: boolean;

    /**
     * Which Map spawned this Area and when.
     */
    spawnedBy: IAreaSpawnedBy;

    /**
     * Wild Pokemon that may appear in this Area.
     */
    wildPokemon: IAreaWildPokemonOptionGroups;

    /**
     * Whether the Player has encountered a Pokemon in this area's grass.
     */
    pokemonEncountered?: boolean;
}

/**
 * A description of how an Area has been stretched by its placed Things.
 */
export interface IAreaBoundaries {
    /**
     * How wide the Area is.
     */
    width: number;

    /**
     * How tall the Area is.
     */
    height: number;

    /**
     * The top border of the boundaries' bounding box.
     */
    top: number;

    /**
     * The right border of the boundaries' bounding box.
     */
    right: number;

    /**
     * The bottom border of the boundaries' bounding box.
     */
    bottom: number;

    /**
     * The left border of the boundaries' bounding box.
     */
    left: number;
}

/**
 * A description of which Map spawned an Area and when.
 */
export interface IAreaSpawnedBy {
    /**
     * The name of the Map that spawned the Area.
     */
    name: string;

    /**
     * When the spawning occurred.
     */
    timestamp: number;
}

/**
 * Types of Pokemon that may appear in an Area, keyed by terrain type, such as "grass".
 */
export interface IAreaWildPokemonOptionGroups {
    /**
     * Types of Pokemon that may appear in grass.
     */
    grass?: IWildPokemonSchema[];

    /**
     * Types of Pokemon that may appear in water.
     */
    fishing?: IWildFishingPokemon;
}

/**
 * A description of a type of Pokemon that may appear in an Area.
 */
export interface IWildPokemonSchema {
    /**
     * The type of Pokemon.
     */
    title: string[];

    /**
     * What level the Pokemon may be, if only one.
     */
    level?: number;

    /**
     * What levels the Pokemon may be, if multiple.
     */
    levels?: number[];

    /**
     * Concatenated names of moves the Pokemon should have.
     */
    moves?: string[];

    /**
     * The rate of appearance for this type of Pokemon, in [0, 1].
     */
    rate?: number;
}

/**
 * A raw JSON-friendly description of a location.
 */
export interface ILocationRaw extends imapscreatr.ILocationRaw {
    /**
     * A cutscene to immediately start upon entering.
     */
    cutscene?: string;

    /**
     * A direction to immediately face the player towards.
     */
    direction?: number;

    /**
     * Whether the player should immediately walk forward.
     */
    push?: boolean;

    /**
     * A cutscene routine to immediately start upon entering.
     */
    routine?: string;

    /**
     * A theme to immediately play upon entering.
     */
    theme?: string;

    /**
     * The x-location in the parent Area.
     */
    xloc?: number;

    /**
     * The y-location in the parent Area.
     */
    yloc?: number;
}

/**
 * A Location parsed from a raw JSON-friendly Map description.
 */
export interface ILocation extends IStateSaveable, imapscreatr.ILocation {
    /**
     * The Area this Location is a part of.
     */
    area: IArea;

    /**
     * A cutscene to immediately start upon entering.
     */
    cutscene?: string;

    /**
     * A direction to immediately face the player towards.
     */
    direction?: number;

    /**
     * Whether the player should immediately walk forward.
     */
    push?: boolean;

    /**
     * A cutscene routine to immediately start upon entering.
     */
    routine?: string;

    /**
     * A theme to immediately play upon entering.
     */
    theme?: string;

    /**
     * The x-location in the parent Area.
     */
    xloc?: number;

    /**
     * The y-location in the parent Area.
     */
    yloc?: number;
}

/**
 * Information on a move's metadata and effects.
 */
export interface IMoveSchema {
    /**
     * The type of move, such as "Water".
     */
    type: string;

    /**
     * What type of damage this does, as "Physical", "Special", or "Non-Damaging".
     */
    damage: string;

    /**
     * What type of alternate effect the move does, such as "Status" or "Raise".
     */
    effect?: string;

    /**
     * The power of the move, as a damage Number or "-".
     */
    power: string | number;

    /**
     * The accuracy of the move, as "<number>%" (such as "70%") or "-".
     */
    accuracy: string;

    /**
     * The maximum PP for the move.
     */
    PP: number;

    /**
     * A friendly description of the move's effects.
     */
    description: string;

    /**
     * How much of an alternate effect the move has for changing statistics.
     */
    amount?: number;

    /**
     * Whether the move has a higher chance of being a critical hit.
     */
    criticalRaised?: boolean;

    /**
     * What status to lower, if applicable.
     */
    lower?: string;

    /**
     * What speed priority this move has.
     */
    priority?: number;

    /**
     * What status to raise, if applicable.
     */
    raise?: string;

    /**
     * Which status to give, such as "Sleep", if applicable.
     */
    status?: string;
}

/**
 * An HM move or move that interacts with the environment.
 */
export interface IHMMoveSchema extends IMoveSchema {
    /**
     * Activates a Function to perform an HM move outside of battle.
     */
    partyActivate?: (player: IPlayer, pokemon: IPokemon) => void;

    /**
     * The HMCharacter that the move affects.
     */
    characterName?: string;

    /**
     * The badge needed to use the HM move.
     */
    requiredBadge?: string;
}

/**
 * A static description of an in-game item.
 * @todo Refactor this when items are implemented.
 */
export interface IItemSchema {
    /**
     * A short description of what the item does, such as "Cures Poison".
     */
    effect: string;

    /**
     * What category of items this falls under, such as "Main", "Pokeball", or "Key".
     */
    category: string;

    /**
     * How much the item costs in a store.
     */
    price?: number;

    /**
     * An error message displayed when you try to use an item at a time when you're not allowed.
     */
    error?: string;

    /**
     * A Function to be called when the item is used.
     */
    bagActivate?: Function;
}

/**
 * The types of Pokemon that can be caught with different rods.
 */
export interface IWildFishingPokemon {
    /**
     * The Pokemon that can be caught using an Old Rod.
     */
    old?: IWildPokemonSchema[];

    /**
     * The Pokemon that can be caught using a Good Rod.
     */
    good?: IWildPokemonSchema[];

    /**
     * The Pokemon that can be caught using a Super Rod.
     */
    super?: IWildPokemonSchema[];
}

/**
 * The type of rod that is being used.
 */
export interface IRod extends IItemSchema {
    /**
     * The type of rod used. Can be old, good, or super.
     * @todo Make type explicitly "old" | "good" | "super".
     */
    type: string;

    /**
     * The name of the rod used.
     */
    title: string;
}

/**
 * A possible move to be chosen, with its probability.
 */
export interface IMovePossibility {
    /**
     * The concatenated name of the move.
     */
    move: string;

    /**
     * What priority the move has, for the applyMoveEffectPriority equation.
     */
    priority: number;
}

/**
 * An in-game Pokeball item.
 */
export interface IBattleBall extends IItemSchema {
    /**
     * A maximum probability N for the canCatchPokemon equation.
     */
    probabilityMax: number;

    /**
     * A multiplier for the opponent Pokemon's HP in canCatchPokemon.
     */
    rate: number;

    /**
     * The type of ball, such as "Great" or "Master".
     */
    type: string;
}

/**
 * A modifier for battle behavior in the opponentMove equation.
 */
export interface IBattleModification {
    /**
     * What type of opponents this applies to.
     */
    opponentType: string[];

    /**
     * Move type preferences, as the type of change, the target, and optionally
     * a Number amount if relevant.
     */
    preferences: ([string, string, number] | [string, string])[];
}

/**
 * In-game state and settings for an ongoing battle.
 */
export interface IBattleInfo extends ibattlemovr.IBattleInfo {
    /**
     * Allowed starting battle animations to choose between.
     */
    animations?: string[];

    /**
     * Whether the battle should advance its menus automatically.
     */
    automaticMenus?: boolean;

    /**
     * A badge to award the player upon victory.
     */
    badge?: string;

    /**
     * 
     */
    battlers: IBattlers;

    /**
     * How many times the player has attempted to flee.
     */
    currentEscapeAttempts?: number;

    /**
     * A gift to give the player upon victory.
     */
    giftAfterBattle?: string;

    /**
     * How much of the gift to give (by default, 1).
     */
    giftAfterBattleAmount?: number;

    /**
     * Things that should be visible above the starting animation.
     */
    keptThings?: IThing[];

    /**
     * Whether losing skip the player blacking out and respawning elsewhere.
     */
    noBlackout?: boolean;

    /**
     * A callback for after showing the player menu.
     */
    onShowPlayerMenu?: () => void;

    /**
     * Text to display after a battle victory when in the real world again.
     */
    textAfterBattle?: imenugraphr.IMenuDialogRaw;

    /**
     * Text to display upon defeat.
     */
    textDefeat?: imenugraphr.IMenuDialogRaw;

    /**
     * Text for when the opponent sends out a Pokemon. The opponent's name and the
     * Pokemon's nickname are between the Strings.
     */
    textOpponentSendOut?: [string, string, string];

    /**
     * Text for when the player sends out a Pokemon. The Pokemon's name is between the 
     * Strings.
     */
    textPlayerSendOut?: [string, string];

    /**
     * Text for when the battle starts. The opponent's name is between the Strings.
     */
    textStart?: [string, string];

    /**
     * Text to display upon victory.
     */
    textVictory?: imenugraphr.IMenuDialogRaw;

    /**
     * An audio theme to play during the battle.
     */
    theme?: string;
}

/**
 * 
 */
export interface IBattlers extends ibattlemovr.IBattlers {
    /**
     * The opponent battler's information.
     */
    opponent: IBattler;

    /**
     * The player's battle information.
     */
    player?: IBattler;

    [i: string]: IBattler | undefined;
}

/**
 * A trainer in battle, namely either the player or opponent.
 */
export interface IBattler extends ibattlemovr.IBattler {
    /**
     * The trainer's available Pokemon.
     */
    actors: IPokemon[];

    /**
     * Whether this opponent doesn't understand status effects, for the opponentMove equation.
     */
    dumb?: boolean;

    /**
     * The amount of money given for defeating this opponent.
     */
    reward?: number;

    /**
     * The trainer's currently selected Pokemon.
     */
    selectedActor?: IPokemon;
}

/**
 * A Pokemon, stored in the player's party and/or as an in-battle actor.
 */
export interface IPokemon extends ibattlemovr.IActor {
    /**
     * Current (in-battle) Attack.
     */
    Attack: number;

    /**
     * Default Attack.
     */
    AttackNormal: number;

    /**
     * Current (in-battle) Defense.
     */
    Defense: number;

    /**
     * Default Defense.
     */
    DefenseNormal: number;

    /**
     * Accumulated effort value points.
     */
    EV: {
        /**
         * Attack EV points.
         */
        Attack: number;

        /**
         * Defense EV points.
         */
        Defense: number;

        /**
         * Special EV points.
         */
        Special: number;

        /**
         * Speed EV points.
         */
        Speed: number;
    };

    /**
     * Current (in-battle) HP.
     */
    HP: number;

    /**
     * Default HP.
     */
    HPNormal: number;

    /**
     * Accumulated individual value points.
     */
    IV: {
        /**
         * Attack IV points.
         */
        Attack: number;

        /**
         * Defense IV points.
         */
        Defense: number;

        /**
         * HP IV points.
         */
        HP: number;

        /**
         * Special IV points.
         */
        Special: number;

        /**
         * Speed IV points.
         */
        Speed: number;
    };

    /**
     * Current (in-battle) Special.
     */
    Special: number;

    /**
     * Default Special.
     */
    SpecialNormal: number;

    /**
     * Current (in-battle) Speed.
     */
    Speed: number;

    /**
     * Default Speed.
     */
    SpeedNormal: number;

    /**
     * How difficult this is to catch, for the canCatchPokemon equation.
     */
    catchRate?: number;

    /**
     * How likely a critical hit is from this Pokemon, for the criticalHit equation.
     */
    criticalHitProbability?: boolean;

    /**
     * The Pokemon's nickname.
     */
    nickname: string[];

    /**
     * The level the Pokemon was before enabling the Level 100 mod.
     */
    previousLevel?: number;

    /**
     * Any current status, such as "Poison".
     */
    status: string;

    /**
     * Whether the Pokemon was traded from another trainer.
     */
    traded?: boolean;

    /**
     * What types this Pokemon is, such as "Water".
     */
    types: string[];
}

/**
 * A description of a simple general text dialog to start.
 */
export interface IDialog {
    /**
     * An optional cutscene to start after the dialog.
     */
    cutscene?: string;

    /**
     * Options for a yes or no dialog menu with callbacks after the dialog.
     */
    options?: IDialogOptions;

    /**
     * The actual text to display in the dialog.
     */
    words: imenugraphr.IMenuDialogRaw;
}

/**
 * Dialog settings for a yes or no menu after a dialog.
 */
export interface IDialogOptions {
    /**
     * What to display after the "Yes" option is activated.
     */
    Yes: string | IDialog;

    /**
     * What to display after the "No" option is activated.
     */
    No: string | IDialog;
}

/**
 * A position holder around an in-game Thing.
 */
export interface IPreThing extends IMapsCreatrIPreThing {
    /**
     * A starting direction to face (by default, up).
     */
    direction?: number;

    /**
     * The in-game Thing.
     */
    thing: IThing;

    /**
     * The raw x-location from the Area's creation command.
     */
    x: number;

    /**
     * The raw y-location from the Area's creation command.
     */
    y: number;

    /**
     * How wide the Thing should be.
     */
    width?: number;

    /**
     * How tall the Thing should be.
     */
    height: number;
}

/**
 * An in-game Thing with size, velocity, position, and other information.
 */
export interface IThing extends igamestartr.IThing, IStateSaveable {
    /**
     * What to do when a Character, commonly a Player, activates this Thing.
     * 
     * @param activator   The Character activating this.
     * @param activated   The Thing being activated.
     */
    activate?: (activator: ICharacter, activated?: IThing) => void;

    /**
     * The area this was spawned by.
     */
    areaName: string;

    /**
     * Things this is touching in each cardinal direction.
     */
    bordering: [IThing | undefined, IThing | undefined, IThing | undefined, IThing | undefined];

    /**
     * Whether this should be chosen over other Things if it is one of multiple
     * potential Thing borders.
     */
    borderPrimary?: boolean;

    /**
     * What to do when a Character collides with this Thing.
     * 
     * @param thing   The Character colliding with this Thing.
     * @param other   This thing being collided by the Character.
     */
    collide: (thing: ICharacter, other: IThing) => boolean;

    /**
     * Animation cycles set by the ITimeHandlr.
     */
    cycles: itimehandlr.ITimeCycles;

    /**
     * Whether this has been killed.
     */
    dead?: boolean;

    /**
     * What cardinal direction this is facing.
     */
    direction: number;

    /**
     * Whether this is undergoing a "flicker" effect by toggling .hidden on an interval.
     */
    flickering?: boolean;

    /**
     * The globally identifiable, potentially unique id of this Thing.
     */
    id: string;

    /**
     * The name of the map that spawned this.
     */
    mapName: string;

    /**
     * Whether this is barred from colliding with other Things.
     */
    nocollide?: boolean;

    /**
     * How many quadrants this is contained within.
     */
    numquads: number;

    /**
     * A horizontal visual offset to shift by.
     */
    offsetX?: number;

    /**
     * A vertical visual offset to shift by.
     */
    offsetY?: number;

    /**
     * Whether to shift this to the "beginning" or "end" of its Things group.
     */
    position: string;

    /**
     * Whether this has been spawned into the game.
     */
    spawned: boolean;

    /**
     * Bottom vertical tolerance for not colliding with another Thing.
     */
    tolBottom: number;

    /**
     * Left vertical tolerance for not colliding with another Thing.
     */
    tolLeft: number;

    /**
     * Right horizontal tolerance for not colliding with another Thing.
     */
    tolRight: number;

    /**
     * Top vertical tolerance for not colliding with another Thing.
     */
    tolTop: number;

    /**
     * Keying by a Direction gives the corresponding bounding box edge.
     */
    [direction: number]: number;
}

/**
 * A Character Thing.
 * @todo This should be separated into its sub-classes the way FSM's ICharacter is.
 */
export interface ICharacter extends IThing {
    /**
     * For custom triggerable Characters, whether this may be used.
     */
    active?: boolean;

    /**
     * A Thing that activated this character.
     */
    collidedTrigger?: IDetector;

    /**
     * A cutscene to activate when interacting with this Character.
     */
    cutscene?: string;

    /**
     * The x- or y- position this will finish walking to, if applicable.
     */
    destination: number;

    /**
     * A dialog to start when activating this Character. If dialogDirections is true,
     * it will be interpreted as a separate dialog for each direction of interaction.
     */
    dialog?: imenugraphr.IMenuDialogRaw | imenugraphr.IMenuDialogRaw[];

    /**
     * Whether dialog should definitely be treated as an Array of one Dialog each direction.
     */
    dialogDirections?: number[];

    /**
     * A single set of dialog (or dialog directions) to play after the primary dialog
     * is complete.
     */
    dialogNext?: imenugraphr.IMenuDialogRaw | imenugraphr.IMenuDialogRaw[];

    /**
     * A dialog to place after the primary dialog as a yes or no menu.
     * @todo If the need arises, this could be changed to any type of menu.
     */
    dialogOptions?: IDialog;

    /**
     * A direction to always face after a dialog completes.
     */
    directionPreferred?: number;

    /**
     * How far this will travel while walking, such as hopping over a ledge. 
     */
    distance: number;

    /**
     * A Character walking directly behind this as a follower.
     */
    follower?: ICharacter;

    /**
     * A Character this is walking directly behind as a follower.
     */
    following?: ICharacter;

    /**
     * The time cycle keeping this behind the Character it's following. 
     */
    followingLoop?: itimehandlr.ITimeEvent;

    /**
     * An item to give after a dialog is first initiated.
     */
    gift?: string;

    /**
     * A grass Scenery partially covering this while walking through a grass area.
     */
    grass?: IGrass;

    /**
     * How high the grass Scenery should be.
     */
    heightGrass?: number;

    /**
     * A scratch variable for height, such as when behind grass.
     */
    heightOld?: number;

    /**
     * Whether this is currently moving, generally from walking.
     */
    isMoving: boolean;

    /**
     * A ledge this is hopping over.
     */
    ledge?: IThing;

    /**
     * A callback for when this starts a single walking step.
     * 
     * @param character   This character that has started walking.
     * @param direction   The direction the Character is facing.
     */
    onWalkingStart: (character: ICharacter, direction: number) => void;

    /**
     * A callback for when this stops a single walking step, commonly to keep walking.
     * 
     * @param character   A Character mid-step.
     * @param onStop   Commands to run as a walking continuation.
     */
    onWalkingStop: (character: ICharacter, onStop: IWalkingOnStop) => void;

    /**
     * Whether this is allowed to be outside the QuadsKeepr quadrants area, or not
     * have a true .alive, without dieing.
     */
    outerOk?: boolean;

    /**
     * Whether this is a Player.
     */
    player?: boolean;

    /**
     * What direction to push the Player back after a dialog, if any.
     */
    pushDirection?: number;

    /**
     * Steps for the Player to take after being pushed back.
     */
    pushSteps?: IWalkingOnStop;

    /**
     * Whether this is sporadically
     */
    roaming?: boolean;

    /**
     * Directions this is allowed to roam.
     */
    roamingDirections?: number[];

    /**
     * How far this can "see" a Player to walk forward and trigger a dialog.
     */
    sight?: number;

    /**
     * The Detector stretching in front of this Thing as its sight.
     */
    sightDetector?: ISightDetector;

    /**
     * A shadow Thing for when this is hopping a ledge.
     */
    shadow?: IThing;

    /**
     * Whether this intends to walk when its current walking step is complete.
     */
    shouldWalk: boolean;

    /**
     * How fast this moves.
     */
    speed: number;

    /**
     * A scratch variable for speed.
     */
    speedOld?: number;

    /**
     * Whether the player is currently surfing.
     */
    surfing?: boolean;

    /**
     * Whether this should turn towards an activating Character when a dialog is triggered.
     */
    switchDirectionOnDialog?: boolean;

    /**
     * Whether this is currently engaging in its activated dialog.
     */
    talking?: boolean;

    /**
     * Whether this is a Pokemon trainer, to start a battle after its dialog.
     */
    trainer?: boolean;

    /**
     * Whether this should transport an activating Character.
     */
    transport?: string | ITransportSchema;

    /**
     * Where this will turn to when its current walking step is complete.
     */
    turning?: number;

    /**
     * Whether this is currently walking.
     */
    walking?: boolean;

    /**
     * A queue of walking commands in waiting, used by its follower.
     */
    walkingCommands?: number[];

    /**
     * The class cycle for flipping back and forth while walking.
     */
    walkingFlipping?: itimehandlr.ITimeEvent;
}

/**
 * An Enemy Thing such as a trainer or wild Pokemon.
 */
export interface IEnemy extends ICharacter {
    /**
     * Actors this trainer will use in battle.
     */
    actors: IWildPokemonSchema[];

    /**
     * Whether this trainer has already battled and shouldn't again.
     */
    alreadyBattled?: boolean;

    /**
     * A badge to gift when this Enemy is defeated.
     */
    badge?: string;

    /**
     * The name this will have in battle.
     */
    battleName?: string;

    /**
     * The sprite this will display as in battle, if not its battleName.
     */
    battleSprite?: string;

    /**
     * A gift to give after defeated in battle.
     */
    giftAfterBattle?: string;

    /**
     * A cutscene to trigger after defeated in battle.
     */
    nextCutscene?: string;

    /**
     * The title of the trainer before enabling the Joey's Rattata mod.
     */
    previousTitle?: string;

    /**
     * A monetary reward to give after defeated in battle.
     */
    reward: number;

    /**
     * Dialog to display after defeated in battle.
     */
    textDefeat?: imenugraphr.IMenuDialogRaw;

    /**
     * Dialog to display after the battle is over.
     */
    textAfterBattle?: imenugraphr.IMenuDialogRaw;

    /**
     * Text display upon victory.
     */
    textVictory?: imenugraphr.IMenuDialogRaw;
}

/**
 * A Player Character.
 */
export interface IPlayer extends ICharacter {
    /**
     * Whether Detectors this collides with should consider walking to be an indication
     * of activation. This is useful for when the Player is following but needs to trigger
     * a Detector anyway.
     */
    allowDirectionAsKeys?: boolean;

    /**
     * Whether this is allowed to start walking via user input.
     */
    canKeyWalking: boolean;

    /**
     * Whether the player is currently bicycling.
     */
    cycling: boolean;

    /**
     * @returns A new descriptor container for key statuses.
     */
    getKeys: () => IPlayerKeys;

    /**
     * A descriptor for a user's keys' statuses.
     */
    keys: IPlayerKeys;

    /**
     * A next direction to turn to after the current walking step.
     */
    nextDirection?: number;
}

/**
 * A descriptor for a user's keys' statuses.
 */
export interface IPlayerKeys {
    /**
     * Whether the user is currently indicating a selection.
     */
    a: boolean;

    /**
     * Whether the user is currently indicating a deselection.
     */
    b: boolean;

    /**
     * Whether the user is currently indicating to go up.
     */
    0: boolean;

    /**
     * Whether the user is currently indicating to go to the right.
     */
    1: boolean;

    /**
     * Whether the user is currently indicating to go down.
     */
    2: boolean;

    /**
     * Whether the user is currently indicating to go to the left.
     */
    3: boolean;
}

/**
 * A Grass Thing.
 */
export interface IGrass extends IThing {
    /**
     * How likely this is to trigger a grass encounter in the doesGrassEncounterHappen
     * equation, as a Number in [0, 187.5].
     */
    rarity: number;
}

/**
 * A Detector Thing. These are typically Solids.
 */
export interface IDetector extends IThing {
    /**
     * Whether this is currently allowed to activate.
     */
    active?: boolean;

    /**
     * A callback for when a Player activates this.
     * 
     * @param thing   The Player activating other, or other if a self-activation.
     * @param other   The Detector being activated by thing.
     */
    activate?: (thing: IPlayer | IDetector, other?: IDetector) => void;

    /**
     * A cutscene to start when this is activated.
     */
    cutscene?: string;

    /**
     * A dialog to start when activating this Character. If an Array, it will be interpreted
     * as a separate dialog for each cardinal direction of interaction.
     */
    dialog?: imenugraphr.IMenuDialogRaw;

    /**
     * Whether this shouldn't be killed after activation (by default, false).
     */
    keepAlive?: boolean;

    /**
     * Whether this requires a direction to be activated.
     */
    requireDirection?: number;

    /**
     * Whether a Player needs to be fully within this Detector to trigger it.
     */
    requireOverlap?: boolean;

    /**
     * A cutscene routine to start when this is activated.
     */
    routine?: string;

    /**
     * Whether this should deactivate itself after a first use (by default, false).
     */
    singleUse?: boolean;
}

/**
 * A Solid with a partyActivate callback Function.
 */
export interface IHMCharacter extends ICharacter {
    /**
     * The name of the move needed to interact with this HMCharacter.
     */
    moveName: string;

    /**
     * The partyActivate Function used to interact with this HMCharacter.
     */
    moveCallback: (player: IPlayer, pokemon: IPokemon) => void;

    /**
     * The badge needed to activate this HMCharacter.
     */
    requiredBadge: string;
}

/**
 * A WaterEdge object.
 */
export interface IWaterEdge extends IHMCharacter {
    /**
     * The direction the Player must go to leave the water.
     */
    exitDirection: number;
}

/**
 * A Detector that adds an Area into the game.
 */
export interface IAreaSpawner extends IDetector {
    /**
     * The Area to add into the game.
     */
    area: string;

    /**
     * The name of the Map to retrieve the Area within.
     */
    map: string;
}

/**
 * A Detector that marks a player as spawning in a different Area.
 */
export interface IAreaGate extends IDetector {
    /**
     * The Area to now spawn within.
     */
    area: string;

    /**
     * The Map to now spawn within.
     */
    map: string;
}

/**
 * A gym statue.
 */
export interface IGymDetector extends IDetector {
    /**
     * The name of the gym.
     */
    gym: string;

    /**
     * The name of the gym's leader.
     */
    leader: string;
}

/**
 * A Detector that activates a menu dialog.
 */
export interface IMenuTriggerer extends IDetector {
    /**
     * The name of the menu, if not "GeneralText".
     */
    menu?: string;

    /**
     * Custom attributes to apply to the menu.
     */
    menuAttributes?: IMenuSchema;

    /**
     * What direction to push the activating Player back after a dialog, if any.
     */
    pushDirection?: number;

    /**
     * Steps for the activating Player to take after being pushed back.
     */
    pushSteps?: IWalkingOnStop;
}

/**
 * An Character's sight Detector.
 */
export interface ISightDetector extends IDetector {
    /**
     * The Character using this Detector as its sight.
     */
    viewer: ICharacter;
}

/**
 * A Detector to play an audio theme.
 */
export interface IThemeDetector extends IDetector {
    /**
     * The audio theme to play.
     */
    theme: string;
}

/**
 * A detector to transport to a new area.
 */
export interface ITransporter extends IDetector {
    transport: string | ITransportSchema;
}

/**
 * A description of where to transport.
 */
export type ITransportSchema = {
    /**
     * The name of the Map to transport to.
     */
    map: string;

    /**
     * The name of the Location to transport to.
     */
    location: string;
};

/**
 * A Pokeball containing some item or trigger.
 */
export interface IPokeball extends IDetector {
    /**
     * The activation action, as "item", "cutscene", "pokedex", "dialog", or "yes/no". 
     */
    action: string;

    /**
     * How many of an item to give, if action is "item".
     */
    amount?: number;

    /**
     * What dialog to say, if action is "dialog".
     */
    dialog?: imenugraphr.IMenuDialogRaw;

    /**
     * What item to give, if action is "item".
     */
    item?: string;

    /**
     * The title of the Pokemon to display, if action is "Pokedex".
     */
    pokemon?: string[];

    /**
     * What routine to play, if action is "cutscene".
     */
    routine?: string;
}

/**
 * General attributes for all menus.
 */
export interface IMenuBase extends imenugraphr.IMenuBase {
    /**
     * Whether this has the dirty visual background.
     */
    dirty?: boolean;

    /**
     * Whether this has the light visual background.
     */
    light?: boolean;

    /**
     * Whether this has the lined visual background.
     */
    lined?: boolean;

    /**
     * Whether this has the plain white visual background.
     */
    plain?: boolean;

    /**
     * Whether this has the water visual background.
     */
    watery?: boolean;
}

/**
 * A schema to specify creating a menu.
 */
export interface IMenuSchema extends imenugraphr.IMenuSchema {
    /**
     * Whether the menu should be hidden.
     */
    hidden?: boolean;
}

/**
 * A Menu Thing.
 */
export interface IMenu extends IMenuBase, IThing {
    /**
     * Children Things attached to the Menu.
     */
    children: IThing[];

    /**
     * How tall this is.
     */
    height: number;

    /**
     * Menu name this is listed under.
     */
    name: string;

    /**
     * Any settings to attach to this Menu.
     */
    settings?: any;

    /**
     * How wide this is.
     */
    width: number;
}

/**
 * A ListMenu Thing.
 */
export interface IListMenu extends IMenu, imenugraphr.IListMenuBase { }

/**
 * A Menu to display the results of a KeyboardKeys Menu. A set of "blank" spaces
 * are available, and filled with Text Things as keyboard characters are chosen.
 */
export interface IKeyboardResultsMenu extends IMenu {
    /**
     * The blinking hypen Thing.
     */
    blinker: IThing;

    /**
     * The complete accumulated values of text characters added, in order.
     */
    completeValue: string[];

    /**
     * The displayed value on the screen.
     */
    displayedValue: string[];

    /**
     * Which blank space is currently available.
     */
    selectedChild: number;
}

/**
 * Steps to take after a Character's current walking step. These should be alternating
 * directions and numbers of steps to take; Function commands are allowed as well.
 */
export type IWalkingOnStop = IWalkingOnStopCommand[];

/**
 * A single command within an IWalkingOnStop. This can be a number (how many steps to keep
 * taking in the current direction), a String (direction to face), Direction (direction to
 * face), or callback Function to evaluate.
 */
export type IWalkingOnStopCommand = number | string | IWalkingOnStopCommandFunction;

/**
 * A callback to run on a Character mid-step. This may return true to indicate to the
 * managing TimeHandlr to stop the walking cycle.
 * 
 * @param thing   The Character mid-step.
 * @returns Either nothing or whether the walking cycle should stop.
 */
export interface IWalkingOnStopCommandFunction {
    (thing: ICharacter): void | boolean;
}

/**
 * Settings for a color fade animation.
 */
export interface IColorFadeSettings {
    /**
     * What color to fade to/from (by default, "White").
     */
    color?: string;

    /**
     * How much to change the color's opacity each tick (by default, .33).
     */
    change?: number;

    /**
     * How many game upkeeps are between each tick (by default, 4).
     */
    speed?: number;

    /**
     * A callback for when the animation completes.
     */
    callback?: () => void;
}

/**
 * Settings to open the LevelUpStats menu for a Pokemon.
 */
export interface ILevelUpStatsMenuSettings {
    /**
     * The Pokemon to display the statistics for.
     */
    pokemon: IPokemon;

    /**
     * A menu container for LevelUpStats.
     */
    container?: string;

    /**
     * A callback for when the menu is deleted.
     */
    onMenuDelete?: () => void;

    /**
     * How to position the menu within its container.
     */
    position?: imenugraphr.IMenuSchemaPosition;

    /**
     * How to size the menu.
     */
    size?: imenugraphr.IMenuSchemaSize;

    /**
     * A horizontal offset for the menu.
     */
    textXOffset?: number;
}

/**
 * Settings to open the Items menu.
 * 
 * @todo Refactor this interface's usage to contain IMenuSchema instead of inheritance.
 */
export interface IItemsMenuSettings extends IMenuSchema {
    /**
     * Items to override the player's inventory.
     */
    items?: IItemSchema[];
}

/**
 * Settings to open a keyboard menu.
 */
export interface IKeyboardMenuSettings {
    /**
     * A callback to replace key presses.
     */
    callback?: (...args: any[]) => void;

    /**
     * An initial complete value for the result (by default, []).
     */
    completeValue?: string[];

    /**
     * Whether the menu should start in lowercase (by default, false).
     */
    lowercase?: boolean;

    /**
     * Which blank space should initially be available (by default, 0).
     */
    selectedChild?: number;

    /**
     * The initial selected index (by default, [0, 0]).
     */
    selectedIndex?: [number, number];

    /**
     * A starting result value (by default, "").
     */
    title?: string;

    /**
     * A starting value to replace the initial underscores.
     */
    value?: string[];
}

/**
 * Things used in battle, stored by id.
 */
export interface IBattleThingsById extends IThingsById {
    /**
     * A container menu for a current battler, if applicable.
     */
    menu: IMenu;

    /**
     * The player's Character.
     */
    player: IPlayer;

    /**
     * The opponent's Character.
     */
    opponent: IEnemy;
}

export interface IBattleTransitionSettings {
    /**
     * In-game state and settings for the upcoming battle.
     */
    battleInfo?: IBattleInfo;

    /**
     * A callback for when the transition completes.
     */
    callback?: () => void;
}

/**
 * Settings for the TransitionLineSpiral battle animation routine.
 */
export interface ITransitionLineSpiralSettings extends IBattleTransitionSettings {
    /**
     * How large the lines should be in units (by default, 15).
     */
    divisor?: number;
}

/**
 * Settings for the TransitionFlash battle animation routine.
 */
export interface ITransitionFlashSettings extends IBattleTransitionSettings {
    /**
     * How much to change opacity each tick (by default, .33).
     */
    change?: number;

    /**
     * How many flashes in total (by default, 6).
     */
    flashes?: number;

    /**
     * The ordered flash colors (by default, ["Black", "White"]).
     */
    flashColors?: string[];

    /**
     * How many upkeeps between change ticks (by default, 1).
     */
    speed?: number;
}

/**
 * Settings for the Battle cutscene routines.
 */
export interface IBattleCutsceneSettings {
    /**
     * In-game state and settings for the ongoing battle.
     */
    battleInfo: IBattleInfo;

    /**
     * The left position of the in-game opponent Thing.
     */
    opponentLeft?: number;

    /**
     * The top position of the in-game opponent Thing.
     */
    opponentTop?: number;

    /**
     * Things used in the battle, stored by id.
     */
    things: IBattleThingsById;
}

/**
 * Settings for a typical routine in the Battle cutscene.
 */
export interface IBattleRoutineSettings {
    /**
     * A callback for when the routine is done, if applicable.
     */
    callback?: () => void;

    /**
     * A name of a routine to play when this is done, if applicable.
     */
    nextRoutine?: string;
}

/**
 * Settings for a typical move-based routine in the Battle cutscene.
 */
export interface IBattleMoveRoutineSettings extends IBattleRoutineSettings {
    /**
     * The name of the attacking battler, as "player" or "opponent".
     */
    attackerName?: string;

    /**
     * A callback for when the move is done.
     */
    callback?: () => void;

    /**
     * The move chosen by the user.
     */
    choiceOpponent?: string;

    /**
     * The move chosen by the user.
     */
    choicePlayer?: string;

    /**
     * How much damage will be done by the move.
     */
    damage?: number;

    /**
     * The name of the attacking battler, as "player" or "opponent".
     */
    defenderName?: string;

    /**
     * Whether the opponent has already moved this round.
     */
    moveOpponentDone?: boolean;

    /**
     * Whether the user has already moved this round.
     */
    movePlayerDone?: boolean;
}

/**
 * Settings for a typical action-based routine in the Battle cutscene.
 */
export interface IBattleActionRoutineSettings extends IBattleRoutineSettings {
    /**
     * Which battler this animation applies to.
     */
    battlerName?: "player" | "opponent";

    /**
     * How much damage this will do, if applicable.
     */
    damage?: number;
}

/**
 * Settings for a typical level-based routine in the Battle cutscene.
 */
export interface IBattleLevelRoutineSettings extends IBattleRoutineSettings {
    /**
     * How many experience points were gained, if applicable.
     */
    experienceGained?: number;
}

/**
 * Settings for an attacking move in battle.
 */
export interface IBattleAttackRoutineSettings extends IBattleRoutineSettings {
    /**
     * The attacking battler's name.
     */
    attackerName?: "player" | "opponent";

    /**
     * The defending battler's name.
     */
    defenderName?: "player" | "opponent";
}

/**
 * Settings for changing a defender's statistic in battle.
 */
export interface IBattleStatisticRoutineSettings extends IBattleAttackRoutineSettings {
    /**
     * How much to change the statistic.
     */
    amount?: number;

    /**
     * The name of the targeted statistic.
     */
    statistic?: string;
}
