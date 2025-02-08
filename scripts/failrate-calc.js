const allInputs = document.querySelector('#all-inputs');

const outputZone = document.querySelector('#fail-rates-output');
const individualOutputs = {};

// const manapointsOutput = document.querySelector('#mana-points-output');
// const mimicManapointsOutput = document.querySelector('#mimic-mana-points-output');
// const mimicryOutputSection = document.querySelector('#mimicry-output-section');

const dexInput = document.querySelector('#dex-score-input-row');
const intInput = document.querySelector('#int-score-input-row');
const wisInput = document.querySelector('#wis-score-input-row');
const chaInput = document.querySelector('#cha-score-input-row');
const statInputs = [dexInput, intInput, wisInput, chaInput];

const schoolSkillInput = document.querySelector('#magicSchoolSkill');

const schoolsThatShare = [
  "fire", "water", "air", "earth", "conveyance",
  "temporal", "nature", "hoffense", "hsupport", "ppower",
  "attunement", "mintrusion", "oshadow", "ounlife"
];

const sharedSchoolInputs = {};
schoolsThatShare.forEach(sch => {
  sharedSchoolInputs[sch] = document.querySelector("#shared-" + sch);
});

const hpCalcLink = document.querySelector('#hp-calc-link');
const mpCalcLink = document.querySelector('#mp-calc-link');

const [DEX, INT, WIS, CHR] = [0, 1, 2, 3];

const profile = {
  currentSchool: "mana",
  abilityScores: [10, 10, 10, 10], //dex, int, wis, cha
  magicSchoolSkills: {
    "mana": 0,
    "fire": 0,
    "water": 0,
    "air": 0,
    "earth": 0,
    "nature": 0,
    "conveyance": 0,
    "divination": 0,
    "temporal": 0,
    "udun": 0,
    "hoffense": 0,
    "hdefense": 0,
    "hcuring": 0,
    "hsupport": 0,
    "oshadow": 0,
    "ospirit": 0,
    "ohereticism": 0,
    "ounlife": 0,
    "druid-arcane": 0,
    "druid-physical": 0,
    "ppower": 0,
    "attunement": 0,
    "mintrusion": 0,
    "astral": 0,
    "necromancy": 0
  }
};

const adjMagStat = [
  0, 0, 0, 1, 1, 1, 2, 2, 3, 3,
  4, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  13, 14, 16, 18, 21, 24, 27, 30, 33, 36,
  39, 42, 45, 48, 51, 54, 57, 60
];

const adjMagFail = [
  99, 99, 99, 99, 99, 50, 30, 20, 15, 12,
  11, 10, 9, 8, 7, 6, 6, 5, 5, 5,
  4, 4, 4, 4, 3, 3, 2, 2, 2, 2,
  1, 1, 1, 1, 1, 0, 0, 0
];

// Entry 0 in the above arrays corresponds to stat value 3.
// So there's an offset of 3 from the stat value to the index.
const STAT_TABLE_OFFSET = 3;

const schoolsData = {
  "mana": {
    schoolID: 0,
    spells: [
      "manathrust-i",
      "manathrust-ii",
      "manathrust-iii",
      "recharge-i",
      "recharge-ii",
      "recharge-iii",
      "disperse-magic",
      "disruption-shield"
    ],
    stats: [INT],
    sharedSchools: []
  },
  "fire": {
    schoolID: 1,
    spells: [
      "globe-of-light-i",
      "globe-of-light-ii",
      "fire-bolt-i",
      "fire-bolt-ii",
      "fire-bolt-iii",
      "elemental-shield-i",
      "elemental-shield-ii",
      "fiery-shield-i",
      "fiery-shield-ii",
      "firewall-i",
      "firewall-ii",
      "fire-ball-i",
      "fire-ball-ii",
      "fireflash-i",
      "fireflash-ii"
    ],
    stats: [INT],
    sharedSchools: ["water", "air", "earth"]
  },
  "water": {
    schoolID: 2,
    spells: [
      "elemental-shield-i",
      "elemental-shield-ii",
      "vapor-i",
      "vapor-ii",
      "vapor-iii",
      "frost-bolt-i",
      "frost-bolt-ii",
      "frost-bolt-iii",
      "ents-potion",
      "water-bolt-i",
      "water-bolt-ii",
      "water-bolt-iii",
      "tidal-wave-i",
      "tidal-wave-ii",
      "frost-barrier-i",
      "frost-barrier-ii",
      "frost-ball-i",
      "frost-ball-ii"
    ],
    stats: [INT],
    sharedSchools: ["fire", "air", "earth"]
  },
  "air": {
    schoolID: 3,
    spells: [
      "elemental-shield-ii",
      "lightning-bolt-i",
      "lightning-bolt-ii",
      "lightning-bolt-iii",
      "noxious-cloud-i",
      "noxious-cloud-ii",
      "noxious-cloud-iii",
      "thunderstorm",
      "wings-of-winds",
      "invisibility",
      "mirage-mirror"
    ],
    stats: [INT],
    sharedSchools: ["fire", "water", "earth", "nature"]
  },
  "earth": {
    schoolID: 4,
    spells: [
      "elemental-shield-ii",
      "acid-bolt-i",
      "acid-bolt-ii",
      "acid-bolt-iii",
      "dig",
      "strike-i",
      "strike-ii",
      "stone-prison",
      "shake"
    ],
    stats: [INT],
    sharedSchools: ["fire", "water", "air"]
  },
  "conveyance": {
    schoolID: 5,
    spells: [
      "phase-door",
      "disarm",
      "teleportation",
      "teleport-away-i",
      "teleport-away-ii",
      "recall",
      "probability-travel",
      "telekinesis-i",
      "mass-stasis",
      "shadow-gate"
    ],
    stats: [INT],
    sharedSchools: ["temporal", "oshadow"]
  },
  "divination": {
    schoolID: 6,
    spells: [
      "detect-monsters",
      "sense-hidden-i",
      "sense-hidden-ii",
      "reveal-ways",
      "identify-i",
      "identify-ii",
      "identify-iii",
      "vision-i",
      "vision-ii",
      "greater-identify",
      "sense-minds"
    ],
    stats: [INT],
    sharedSchools: []
  },
  "temporal": {
    schoolID: 7,
    spells: [
      "mass-stasis",
      "magelock-i",
      "magelock-ii",
      "slow-monster-i",
      "slow-monster-ii",
      "essence-of-speed"
    ],
    stats: [INT],
    sharedSchools: ["conveyance"]
  },
  "nature": {
    schoolID: 8,
    spells: [
      "thunderstorm",
      "healing-i",
      "healing-ii",
      "healing-iii",
      "grasping-vines-i",
      "grasping-vines-ii",
      "vermin-control",
      "recovery-i",
      "recovery-ii",
      "regeneration",
      "remove-curses-i",
      "remove-curses-ii",
      "grow-trees",
      "poison-blood"
    ],
    stats: [INT],
    sharedSchools: ["air"]
  },
  "udun": {
    schoolID: 9,
    spells: [
      "confusion-i",
      "confusion-ii",
      "stun-i",
      "stun-ii",
      "hellfire-i",
      "hellfire-ii",
      "genocide",
      "disenchantment-ray",
      "obliteration",
      "wraithform",
      "stop-wraithform"
    ],
    stats: [INT, WIS],
    sharedSchools: []
  },
  "hoffense": {
    schoolID: 10,
    spells: [
      "curse-i",
      "curse-ii",
      "curse-iii",
      "call-light-i",
      "call-light-ii",
      "redemption-i",
      "redemption-ii",
      "redemption-iii",
      "ray-of-light",
      "exorcism-i",
      "exorcism-ii",
      "orb-of-draining-i",
      "orb-of-draining-ii",
      "chaos-bolt",
      "doomed-grounds",
      "earthquake"
    ],
    stats: [WIS],
    sharedSchools: ["hsupport", "oshadow"]
  },
  "hdefense": {
    schoolID: 11,
    spells: [
      "blessing-i",
      "blessing-ii",
      "blessing-iii",
      "dispel-magic",
      "protection-from-evil",
      "holy-resistance-i",
      "holy-resistance-ii",
      "holy-resistance-iii",
      "glyph-of-warding",
      "martyrdom"
    ],
    stats: [WIS],
    sharedSchools: []
  },
  "hcuring": {
    schoolID: 12,
    spells: [
      "curing-i",
      "curing-ii",
      "curing-iii",
      "cure-wounds-i",
      "cure-wounds-ii",
      "heal-i",
      "heal-ii",
      "heal-iii",
      "break-curses-i",
      "break-curses-ii",
      "cleansing-light-i",
      "cleansing-light-ii",
      "cleansing-light-iii",
      "faithful-focus",
      "soul-curing",
      "resurrection",
      "restoration"
    ],
    stats: [WIS],
    sharedSchools: []
  },
  "hsupport": {
    schoolID: 13,
    spells: [
      "call-light-i",
      "call-light-ii",
      "remove-fear",
      "detect-evil",
      "sanctuary-i",
      "sanctuary-ii",
      "satisfy-hunger",
      "sense-surroundings-i",
      "sense-surroundings-ii",
      "zeal-i",
      "zeal-ii",
      "zeal-iii",
      "sense-monsters"
    ],
    stats: [WIS],
    sharedSchools: ["hoffense"]
  },
  "druid-arcane": {
    schoolID: 14,
    spells: [
      "toxic-moisture-i",
      "toxic-moisture-ii",
      "toxic-moisture-iii",
      "natures-call",
      "ancient-lore",
      "garden-of-the-gods",
      "call-of-the-forest"
    ],
    stats: [WIS],
    sharedSchools: []
  },
  "druid-physical": {
    schoolID: 15,
    spells: [
      "focus-i",
      "focus-ii",
      "herbal-tea",
      "quickfeet",
      "extra-growth-i",
      "extra-growth-ii",
      "forests-embrace-i",
      "forests-embrace-ii",
      "forests-embrace-iii"
    ],
    stats: [WIS],
    sharedSchools: []
  },
  "ppower": {
    schoolID: 16,
    spells: [
      "psychic-hammer",
      "psychokinesis",
      "autokinesis-i",
      "autokinesis-ii",
      "autokinesis-iii",
      "feedback",
      "pyrokinesis-i",
      "pyrokinesis-ii",
      "cryokinesis-i",
      "cryokinesis-ii",
      "psychic-warp",
      "telekinesis-ii",
      "kinetic-shield"
    ],
    stats: [INT],
    sharedSchools: ["attunement"]
  },
  "attunement": {
    schoolID: 17,
    spells: [
      "telekinesis-ii",
      "clear-mind",
      "willpower",
      "self-reflection",
      "recognition",
      "accelerate-nerves",
      "telepathy",
      "stabilize-thoughts"
    ],
    stats: [INT],
    sharedSchools: ["ppower", "mintrusion"]
  },
  "mintrusion": {
    schoolID: 18,
    spells: [
      "recognition",
      "psionic-blast-i",
      "psionic-blast-ii",
      "psionic-blast-iii",
      "scare-i",
      "scare-ii",
      "confuse-i",
      "confuse-ii",
      "hypnosis-i",
      "hypnosis-ii",
      "apathy-i",
      "apathy-ii",
      "psychic-suppression",
      "psi-storm-i",
      "psi-storm-ii",
      "remote-vision",
      "charm-i",
      "charm-ii",
      "charm-iii",
      "stop-charm"
    ],
    stats: [INT, CHR],
    sharedSchools: ["attunement"]
  },
  "astral": {
    schoolID: 19,
    spells: [
      "power-bolt-i",
      "power-bolt-ii",
      "power-bolt-iii",
      "power-ray-i",
      "power-ray-ii",
      "power-ray-iii",
      "power-blast-i",
      "power-blast-ii",
      "power-blast-iii",
      "relocation",
      "vengeance",
      "empowerment",
      "the-silent-force",
      "sphere-of-destruction",
      "gateway"
    ],
    stats: [INT, WIS],
    sharedSchools: []
  },
  "oshadow": {
    schoolID: 20,
    spells: [
      "chaos-bolt",
      "doomed-grounds",
      "cause-fear-i",
      "cause-fear-ii",
      "blindness",
      "veil-of-night-i",
      "veil-of-night-ii",
      "shadow-bolt-i",
      "shadow-bolt-ii",
      "shadow-bolt-iii",
      "detect-invisible",
      "retreat",
      "aspect-of-peril",
      "darkness",
      "shadow-stream",
      "shadow-gate",
      "shadow-shroud",
      "dispersion",
      "stop-dispersion",
      "drain-life",
      "darkness-storm",
      "wraithstep"
    ],
    stats: [INT, WIS],
    sharedSchools: ["hoffense", "conveyance", "necromancy", "ounlife"]
  },
  "ospirit": {
    schoolID: 21,
    spells: [
      "cause-wounds-i",
      "cause-wounds-ii",
      "cause-wounds-iii",
      "tame-fear",
      "starlight-i",
      "starlight-ii",
      "meditation",
      "trance",
      "lightning-i",
      "lightning-ii",
      "lightning-iii",
      "spear-of-light-i",
      "spear-of-light-ii",
      "spear-of-light-iii",
      "lift-curses-i",
      "lift-curses-ii",
      "possess-i",
      "possess-ii",
      "possess-iii",
      "stop-possess",
      "ethereal-eye",
      "guardian-spirit-i",
      "guardian-spirit-ii",
      "purification-rites-i",
      "purification-rites-ii"
    ],
    stats: [INT, WIS],
    sharedSchools: []
  },
  "ohereticism": {
    schoolID: 22,
    spells: [
      "terror-i",
      "terror-ii",
      "ignore-fear",
      "o-fire-bolt-i",
      "o-fire-bolt-ii",
      "o-fire-bolt-iii",
      "wrathflame",
      "flame-wave-i",
      "flame-wave-ii",
      "demonic-strength",
      "boundless-rage-i",
      "boundless-rage-ii",
      "wicked-oath",
      "levitation",
      "robes-of-havoc",
      "blood-sacrifice"
    ],
    stats: [INT, WIS],
    sharedSchools: []
  },
  "ounlife": {
    schoolID: 23,
    spells: [
      "fatigue-i",
      "fatigue-ii",
      "detect-lifeforce",
      "tainted-grounds",
      "mists-of-decay-i",
      "mists-of-decay-ii",
      "nether-sap",
      "subjugation",
      "nether-bolt",
      "permeation",
      "siphon-life",
      "touch-of-hunger",
      "wraithstep"
    ],
    stats: [WIS],
    sharedSchools: ["necromancy", "oshadow"]
  }
};

const spellData = [
  {name: "manathrust-i", level: 1, fail: 10, stat: INT, schools: ["mana"]},
  {name: "manathrust-ii", level: 20, fail: -20, stat: INT, schools: ["mana"]},
  {name: "manathrust-iii", level: 40, fail: -75, stat: INT, schools: ["mana"]},
  {name: "recharge-i", level: 5, fail: 20, stat: INT, schools: ["mana"]},
  {name: "recharge-ii", level: 25, fail: -25, stat: INT, schools: ["mana"]},
  {name: "recharge-iii", level: 40, fail: -65, stat: INT, schools: ["mana"]},
  {name: "disperse-magic", level: 15, fail: 10, stat: INT, schools: ["mana"]},
  {name: "disruption-shield", level: 35, fail: 10, stat: INT, schools: ["mana"]},
  {name: "globe-of-light-i", level: 2, fail: 10, stat: INT, schools: ["fire"]},
  {name: "globe-of-light-ii", level: 22, fail: -25, stat: INT, schools: ["fire"]},
  {name: "fire-bolt-i", level: 4, fail: -5, stat: INT, schools: ["fire"]},
  {name: "fire-bolt-ii", level: 25, fail: -30, stat: INT, schools: ["fire"]},
  {name: "fire-bolt-iii", level: 40, fail: -75, stat: INT, schools: ["fire"]},
  {name: "elemental-shield-i", level: 15, fail: 20, stat: INT, schools: ["fire", "water"]},
  {name: "elemental-shield-ii", level: 20, fail: -5, stat: INT, schools: ["fire", "water", "air", "earth"]},
  {name: "fiery-shield-i", level: 16, fail: 0, stat: INT, schools: ["fire"]},
  {name: "fiery-shield-ii", level: 36, fail: -55, stat: INT, schools: ["fire"]},
  {name: "firewall-i", level: 20, fail: -10, stat: INT, schools: ["fire"]},
  {name: "firewall-ii", level: 40, fail: -70, stat: INT, schools: ["fire"]},
  {name: "fire-ball-i", level: 23, fail: -25, stat: INT, schools: ["fire"]},
  {name: "fire-ball-ii", level: 40, fail: -90, stat: INT, schools: ["fire"]},
  {name: "fireflash-i", level: 30, fail: -50, stat: INT, schools: ["fire"]},
  {name: "fireflash-ii", level: 42, fail: -90, stat: INT, schools: ["fire"]},
  {name: "vapor-i", level: 2, fail: 20, stat: INT, schools: ["water"]},
  {name: "vapor-ii", level: 20, fail: -20, stat: INT, schools: ["water"]},
  {name: "vapor-iii", level: 40, fail: -75, stat: INT, schools: ["water"]},
  {name: "frost-bolt-i", level: 3, fail: -5, stat: INT, schools: ["water"]},
  {name: "frost-bolt-ii", level: 22, fail: -30, stat: INT, schools: ["water"]},
  {name: "frost-bolt-iii", level: 40, fail: -75, stat: INT, schools: ["water"]},
  {name: "ents-potion", level: 6, fail: 20, stat: INT, schools: ["water"]},
  {name: "water-bolt-i", level: 10, fail: -5, stat: INT, schools: ["water"]},
  {name: "water-bolt-ii", level: 24, fail: -34, stat: INT, schools: ["water"]},
  {name: "water-bolt-iii", level: 40, fail: -75, stat: INT, schools: ["water"]},
  {name: "tidal-wave-i", level: 16, fail: -10, stat: INT, schools: ["water"]},
  {name: "tidal-wave-ii", level: 36, fail: -60, stat: INT, schools: ["water"]},
  {name: "frost-barrier-i", level: 22, fail: 20, stat: INT, schools: ["water"]},
  {name: "frost-barrier-ii", level: 37, fail: -50, stat: INT, schools: ["water"]},
  {name: "frost-ball-i", level: 22, fail: -25, stat: INT, schools: ["water"]},
  {name: "frost-ball-ii", level: 40, fail: -90, stat: INT, schools: ["water"]},
  {name: "lightning-bolt-i", level: 2, fail: -5, stat: INT, schools: ["air"]},
  {name: "lightning-bolt-ii", level: 21, fail: -30, stat: INT, schools: ["air"]},
  {name: "lightning-bolt-iii", level: 40, fail: -75, stat: INT, schools: ["air"]},
  {name: "noxious-cloud-i", level: 3, fail: 20, stat: INT, schools: ["air"]},
  {name: "noxious-cloud-ii", level: 18, fail: -40, stat: INT, schools: ["air"]},
  {name: "noxious-cloud-iii", level: 33, fail: -70, stat: INT, schools: ["air"]},
  {name: "thunderstorm", level: 15, fail: 0, stat: INT, schools: ["air", "nature"]},
  {name: "wings-of-winds", level: 16, fail: 70, stat: INT, schools: ["air"]},
  {name: "invisibility", level: 30, fail: -30, stat: INT, schools: ["air"]},
  {name: "mirage-mirror", level: 35, fail: -75, stat: INT, schools: ["air"]},
  {name: "acid-bolt-i", level: 5, fail: -5, stat: INT, schools: ["earth"]},
  {name: "acid-bolt-ii", level: 24, fail: -30, stat: INT, schools: ["earth"]},
  {name: "acid-bolt-iii", level: 40, fail: -75, stat: INT, schools: ["earth"]},
  {name: "dig", level: 12, fail: 10, stat: INT, schools: ["earth"]},
  {name: "strike-i", level: 25, fail: 10, stat: INT, schools: ["earth"]},
  {name: "strike-ii", level: 37, fail: -50, stat: INT, schools: ["earth"]},
  {name: "stone-prison", level: 33, fail: -10, stat: INT, schools: ["earth"]},
  {name: "shake", level: 37, fail: 15, stat: INT, schools: ["earth"]},
  {name: "healing-i", level: 1, fail: 10, stat: INT, schools: ["nature"]},
  {name: "healing-ii", level: 20, fail: -30, stat: INT, schools: ["nature"]},
  {name: "healing-iii", level: 40, fail: -70, stat: INT, schools: ["nature"]},
  {name: "grasping-vines-i", level: 6, fail: 10, stat: INT, schools: ["nature"]},
  {name: "grasping-vines-ii", level: 23, fail: -20, stat: INT, schools: ["nature"]},
  {name: "vermin-control", level: 10, fail: 20, stat: INT, schools: ["nature"]},
  {name: "recovery-i", level: 15, fail: 10, stat: INT, schools: ["nature"]},
  {name: "recovery-ii", level: 35, fail: -30, stat: INT, schools: ["nature"]},
  {name: "regeneration", level: 20, fail: 0, stat: INT, schools: ["nature"]},
  {name: "remove-curses-i", level: 20, fail: 20, stat: INT, schools: ["nature"]},
  {name: "remove-curses-ii", level: 40, fail: -20, stat: INT, schools: ["nature"]},
  {name: "grow-trees", level: 30, fail: -30, stat: INT, schools: ["nature"]},
  {name: "poison-blood", level: 30, fail: -30, stat: INT, schools: ["nature"]},
  {name: "phase-door", level: 2, fail: 10, stat: INT, schools: ["conveyance"]},
  {name: "disarm", level: 5, fail: 10, stat: INT, schools: ["conveyance"]},
  {name: "teleportation", level: 10, fail: 50, stat: INT, schools: ["conveyance"]},
  {name: "teleport-away-i", level: 23, fail: 0, stat: INT, schools: ["conveyance"]},
  {name: "teleport-away-ii", level: 43, fail: -60, stat: INT, schools: ["conveyance"]},
  {name: "recall", level: 30, fail: 20, stat: INT, schools: ["conveyance"]},
  {name: "probability-travel", level: 35, fail: 20, stat: INT, schools: ["conveyance"]},
  {name: "telekinesis-i", level: 40, fail: 10, stat: INT, schools: ["conveyance"]},
  {name: "mass-stasis", level: 45, fail: -70, stat: INT, schools: ["temporal", "conveyance"]},
  {name: "detect-monsters", level: 4, fail: 10, stat: INT, schools: ["divination"]},
  {name: "sense-hidden-i", level: 5, fail: 10, stat: INT, schools: ["divination"]},
  {name: "sense-hidden-ii", level: 20, fail: -10, stat: INT, schools: ["divination"]},
  {name: "reveal-ways", level: 6, fail: 10, stat: INT, schools: ["divination"]},
  {name: "identify-i", level: 8, fail: 30, stat: INT, schools: ["divination"]},
  {name: "identify-ii", level: 25, fail: -15, stat: INT, schools: ["divination"]},
  {name: "identify-iii", level: 35, fail: -40, stat: INT, schools: ["divination"]},
  {name: "vision-i", level: 18, fail: 0, stat: INT, schools: ["divination"]},
  {name: "vision-ii", level: 40, fail: -30, stat: INT, schools: ["divination"]},
  {name: "greater-identify", level: 35, fail: 10, stat: INT, schools: ["divination"]},
  {name: "sense-minds", level: 40, fail: -30, stat: INT, schools: ["divination"]},
  {name: "magelock-i", level: 1, fail: 10, stat: INT, schools: ["temporal"]},
  {name: "magelock-ii", level: 41, fail: -60, stat: INT, schools: ["temporal"]},
  {name: "slow-monster-i", level: 10, fail: 10, stat: INT, schools: ["temporal"]},
  {name: "slow-monster-ii", level: 30, fail: -30, stat: INT, schools: ["temporal"]},
  {name: "essence-of-speed", level: 15, fail: 0, stat: INT, schools: ["temporal"]},
  {name: "confusion-i", level: 5, fail: 10, stat: INT, schools: ["udun"]},
  {name: "confusion-ii", level: 20, fail: -15, stat: INT, schools: ["udun"]},
  {name: "stun-i", level: 15, fail: 0, stat: INT, schools: ["udun"]},
  {name: "stun-ii", level: 40, fail: -65, stat: INT, schools: ["udun"]},
  {name: "hellfire-i", level: 20, fail: -10, stat: INT, schools: ["udun"]},
  {name: "hellfire-ii", level: 40, fail: -75, stat: INT, schools: ["udun"]},
  {name: "genocide", level: 30, fail: -10, stat: WIS, schools: ["udun"]},
  {name: "disenchantment-ray", level: 40, fail: -40, stat: INT, schools: ["udun"]},
  {name: "obliteration", level: 40, fail: -40, stat: WIS, schools: ["udun"]},
  {name: "wraithform", level: 43, fail: -40, stat: INT, schools: ["udun"]},
  {name: "stop-wraithform", level: 43, fail: 101, stat: INT, schools: ["udun"]},
  {name: "curse-i", level: 1, fail: 10, stat: WIS, schools: ["hoffense"]},
  {name: "curse-ii", level: 16, fail: -15, stat: WIS, schools: ["hoffense"]},
  {name: "curse-iii", level: 26, fail: -45, stat: WIS, schools: ["hoffense"]},
  {name: "call-light-i", level: 2, fail: 10, stat: WIS, schools: ["hoffense", "hsupport"]},
  {name: "call-light-ii", level: 20, fail: -25, stat: WIS, schools: ["hoffense", "hsupport"]},
  {name: "redemption-i", level: 10, fail: 25, stat: WIS, schools: ["hoffense"]},
  {name: "redemption-ii", level: 25, fail: -40, stat: WIS, schools: ["hoffense"]},
  {name: "redemption-iii", level: 40, fail: -85, stat: WIS, schools: ["hoffense"]},
  {name: "ray-of-light", level: 18, fail: -30, stat: WIS, schools: ["hoffense"]},
  {name: "exorcism-i", level: 20, fail: -15, stat: WIS, schools: ["hoffense"]},
  {name: "exorcism-ii", level: 40, fail: -90, stat: WIS, schools: ["hoffense"]},
  {name: "orb-of-draining-i", level: 20, fail: 10, stat: WIS, schools: ["hoffense"]},
  {name: "orb-of-draining-ii", level: 40, fail: -90, stat: WIS, schools: ["hoffense"]},
  {name: "chaos-bolt", level: 29, fail: -55, stat: WIS, schools: ["ohereticism"]},
  {name: "chaos-bolt", level: 30, fail: -55, stat: WIS, schools: ["oshadow", "hoffense"]},
  {name: "doomed-grounds", level: 40, fail: -35, stat: WIS, schools: ["hoffense", "oshadow"]},
  {name: "earthquake", level: 42, fail: -50, stat: WIS, schools: ["hoffense"]},
  {name: "blessing-i", level: 3, fail: 10, stat: WIS, schools: ["hdefense"]},
  {name: "blessing-ii", level: 15, fail: -7, stat: WIS, schools: ["hdefense"]},
  {name: "blessing-iii", level: 30, fail: -50, stat: WIS, schools: ["hdefense"]},
  {name: "dispel-magic", level: 10, fail: 10, stat: WIS, schools: ["hdefense"]},
  {name: "protection-from-evil", level: 12, fail: 0, stat: WIS, schools: ["hdefense"]},
  {name: "holy-resistance-i", level: 20, fail: -25, stat: WIS, schools: ["hdefense"]},
  {name: "holy-resistance-ii", level: 30, fail: -50, stat: WIS, schools: ["hdefense"]},
  {name: "holy-resistance-iii", level: 40, fail: -80, stat: WIS, schools: ["hdefense"]},
  {name: "glyph-of-warding", level: 35, fail: 0, stat: WIS, schools: ["hdefense"]},
  {name: "martyrdom", level: 47, fail: -60, stat: WIS, schools: ["hdefense"]},
  {name: "curing-i", level: 1, fail: 20, stat: WIS, schools: ["hcuring"]},
  {name: "curing-ii", level: 11, fail: 0, stat: WIS, schools: ["hcuring"]},
  {name: "curing-iii", level: 21, fail: -31, stat: WIS, schools: ["hcuring"]},
  {name: "cure-wounds-i", level: 3, fail: 15, stat: WIS, schools: ["hcuring"]},
  {name: "cure-wounds-ii", level: 23, fail: -38, stat: WIS, schools: ["hcuring"]},
  {name: "heal-i", level: 3, fail: 25, stat: WIS, schools: ["hcuring"]},
  {name: "heal-ii", level: 23, fail: -38, stat: WIS, schools: ["hcuring"]},
  {name: "heal-iii", level: 40, fail: -87, stat: WIS, schools: ["hcuring"]},
  {name: "break-curses-i", level: 10, fail: 25, stat: WIS, schools: ["hcuring"]},
  {name: "break-curses-ii", level: 35, fail: -25, stat: WIS, schools: ["hcuring"]},
  {name: "cleansing-light-i", level: 18, fail: 0, stat: WIS, schools: ["hcuring"]},
  {name: "cleansing-light-ii", level: 29, fail: -55, stat: WIS, schools: ["hcuring"]},
  {name: "cleansing-light-iii", level: 40, fail: -85, stat: WIS, schools: ["hcuring"]},
  {name: "faithful-focus", level: 21, fail: 50, stat: WIS, schools: ["hcuring"]},
  {name: "soul-curing", level: 25, fail: 30, stat: WIS, schools: ["hcuring"]},
  {name: "resurrection", level: 30, fail: 50, stat: WIS, schools: ["hcuring"]},
  {name: "restoration", level: 31, fail: -35, stat: WIS, schools: ["hcuring"]},
  {name: "remove-fear", level: 1, fail: 10, stat: WIS, schools: ["hsupport"]},
  {name: "detect-evil", level: 4, fail: 15, stat: WIS, schools: ["hsupport"]},
  {name: "sanctuary-i", level: 6, fail: 10, stat: WIS, schools: ["hsupport"]},
  {name: "sanctuary-ii", level: 23, fail: -35, stat: WIS, schools: ["hsupport"]},
  {name: "satisfy-hunger", level: 10, fail: 40, stat: WIS, schools: ["hsupport"]},
  {name: "sense-surroundings-i", level: 20, fail: -20, stat: WIS, schools: ["hsupport"]},
  {name: "sense-surroundings-ii", level: 40, fail: -65, stat: WIS, schools: ["hsupport"]},
  {name: "zeal-i", level: 27, fail: -35, stat: WIS, schools: ["hsupport"]},
  {name: "zeal-ii", level: 37, fail: -85, stat: WIS, schools: ["hsupport"]},
  {name: "zeal-iii", level: 47, fail: -110, stat: WIS, schools: ["hsupport"]},
  {name: "sense-monsters", level: 33, fail: -55, stat: WIS, schools: ["hsupport"]},
  {name: "cause-fear-i", level: 1, fail: 0, stat: WIS, schools: ["oshadow"]},
  {name: "cause-fear-ii", level: 14, fail: -30, stat: WIS, schools: ["oshadow"]},
  {name: "blindness", level: 3, fail: 0, stat: INT, schools: ["oshadow"]},
  {name: "veil-of-night-i", level: 5, fail: 0, stat: WIS, schools: ["oshadow"]},
  {name: "veil-of-night-ii", level: 20, fail: -30, stat: WIS, schools: ["oshadow"]},
  {name: "shadow-bolt-i", level: 6, fail: -6, stat: INT, schools: ["oshadow"]},
  {name: "shadow-bolt-ii", level: 25, fail: -40, stat: INT, schools: ["oshadow"]},
  {name: "shadow-bolt-iii", level: 40, fail: -80, stat: INT, schools: ["oshadow"]},
  {name: "detect-invisible", level: 8, fail: 10, stat: INT, schools: ["oshadow"]},
  {name: "retreat", level: 8, fail: -7, stat: INT, schools: ["oshadow"]},
  {name: "aspect-of-peril", level: 10, fail: -10, stat: INT, schools: ["oshadow"]},
  {name: "darkness", level: 16, fail: -30, stat: INT, schools: ["oshadow"]},
  {name: "shadow-stream", level: 18, fail: -20, stat: INT, schools: ["oshadow"]},
  {name: "shadow-gate", level: 26, fail: -50, stat: INT, schools: ["oshadow", "conveyance"]},
  {name: "shadow-shroud", level: 30, fail: -40, stat: INT, schools: ["oshadow"]},
  {name: "dispersion", level: 33, fail: -60, stat: WIS, schools: ["oshadow"]},
  {name: "stop-dispersion", level: 33, fail: 101, stat: WIS, schools: ["oshadow"]},
  {name: "drain-life", level: 37, fail: -60, stat: WIS, schools: ["oshadow", "necromancy"]},
  {name: "darkness-storm", level: 42, fail: -90, stat: INT, schools: ["oshadow"]},
  {name: "cause-wounds-i", level: 1, fail: 10, stat: WIS, schools: ["ospirit"]},
  {name: "cause-wounds-ii", level: 20, fail: -30, stat: WIS, schools: ["ospirit"]},
  {name: "cause-wounds-iii", level: 40, fail: -80, stat: WIS, schools: ["ospirit"]},
  {name: "tame-fear", level: 1, fail: 10, stat: WIS, schools: ["ospirit"]},
  {name: "starlight-i", level: 2, fail: 10, stat: INT, schools: ["ospirit"]},
  {name: "starlight-ii", level: 22, fail: -20, stat: INT, schools: ["ospirit"]},
  {name: "meditation", level: 4, fail: 10, stat: WIS, schools: ["ospirit"]},
  {name: "trance", level: 5, fail: 10, stat: WIS, schools: ["ospirit"]},
  {name: "lightning-i", level: 10, fail: -10, stat: INT, schools: ["ospirit"]},
  {name: "lightning-ii", level: 25, fail: -40, stat: INT, schools: ["ospirit"]},
  {name: "lightning-iii", level: 40, fail: -80, stat: INT, schools: ["ospirit"]},
  {name: "spear-of-light-i", level: 10, fail: -8, stat: WIS, schools: ["ospirit"]},
  {name: "spear-of-light-ii", level: 25, fail: -40, stat: WIS, schools: ["ospirit"]},
  {name: "spear-of-light-iii", level: 40, fail: -75, stat: WIS, schools: ["ospirit"]},
  {name: "lift-curses-i", level: 15, fail: 20, stat: WIS, schools: ["ospirit"]},
  {name: "lift-curses-ii", level: 35, fail: -20, stat: WIS, schools: ["ospirit"]},
  {name: "possess-i", level: 23, fail: -30, stat: WIS, schools: ["ospirit"]},
  {name: "possess-ii", level: 31, fail: -42, stat: WIS, schools: ["ospirit"]},
  {name: "possess-iii", level: 39, fail: -66, stat: WIS, schools: ["ospirit"]},
  {name: "stop-possess", level: 23, fail: -99, stat: WIS, schools: ["ospirit"]},
  {name: "ethereal-eye", level: 28, fail: -10, stat: WIS, schools: ["ospirit"]},
  {name: "guardian-spirit-i", level: 25, fail: -30, stat: WIS, schools: ["ospirit"]},
  {name: "guardian-spirit-ii", level: 45, fail: -80, stat: WIS, schools: ["ospirit"]},
  {name: "purification-rites-i", level: 30, fail: -45, stat: WIS, schools: ["ospirit"]},
  {name: "purification-rites-ii", level: 45, fail: -90, stat: WIS, schools: ["ospirit"]},
  {name: "terror-i", level: 3, fail: 10, stat: WIS, schools: ["ohereticism"]},
  {name: "terror-ii", level: 13, fail: -20, stat: WIS, schools: ["ohereticism"]},
  {name: "ignore-fear", level: 6, fail: 10, stat: WIS, schools: ["ohereticism"]},
  {name: "fire-bolt-i", level: 6, fail: -5, stat: INT, schools: ["ohereticism"]},
  {name: "fire-bolt-ii", level: 25, fail: -30, stat: INT, schools: ["ohereticism"]},
  {name: "fire-bolt-iii", level: 40, fail: -75, stat: INT, schools: ["ohereticism"]},
  {name: "wrathflame", level: 8, fail: 0, stat: WIS, schools: ["ohereticism"]},
  {name: "flame-wave-i", level: 20, fail: -35, stat: INT, schools: ["ohereticism"]},
  {name: "flame-wave-ii", level: 35, fail: -75, stat: INT, schools: ["ohereticism"]},
  {name: "demonic-strength", level: 23, fail: -30, stat: WIS, schools: ["ohereticism"]},
  {name: "boundless-rage-i", level: 29, fail: -40, stat: WIS, schools: ["ohereticism"]},
  {name: "boundless-rage-ii", level: 41, fail: -85, stat: WIS, schools: ["ohereticism"]},
  {name: "wicked-oath", level: 35, fail: -35, stat: WIS, schools: ["ohereticism"]},
  {name: "levitation", level: 39, fail: -70, stat: INT, schools: ["ohereticism"]},
  {name: "robes-of-havoc", level: 44, fail: -75, stat: INT, schools: ["ohereticism"]},
  {name: "blood-sacrifice", level: 47, fail: -60, stat: WIS, schools: ["ohereticism"]},
  {name: "fatigue-i", level: 5, fail: 0, stat: WIS, schools: ["ounlife"]},
  {name: "fatigue-ii", level: 20, fail: -30, stat: WIS, schools: ["ounlife"]},
  {name: "detect-lifeforce", level: 11, fail: 5, stat: WIS, schools: ["ounlife"]},
  {name: "tainted-grounds", level: 13, fail: 10, stat: WIS, schools: ["ounlife"]},
  {name: "mists-of-decay-i", level: 20, fail: -30, stat: WIS, schools: ["ounlife"]},
  {name: "mists-of-decay-ii", level: 40, fail: -85, stat: WIS, schools: ["ounlife"]},
  {name: "nether-sap", level: 22, fail: -30, stat: WIS, schools: ["ounlife"]},
  {name: "subjugation", level: 26, fail: -55, stat: WIS, schools: ["ounlife", "necromancy"]},
  {name: "nether-bolt", level: 30, fail: -55, stat: WIS, schools: ["ounlife"]},
  {name: "permeation", level: 35, fail: -70, stat: WIS, schools: ["ounlife"]},
  {name: "siphon-life", level: 37, fail: -70, stat: WIS, schools: ["ounlife"]},
  {name: "touch-of-hunger", level: 42, fail: -80, stat: WIS, schools: ["ounlife"]},
  {name: "wraithstep", level: 46, fail: -95, stat: WIS, schools: ["ounlife", "oshadow"]},
  {name: "toxic-moisture-i", level: 3, fail: 20, stat: WIS, schools: ["druid-arcane"]},
  {name: "toxic-moisture-ii", level: 20, fail: -35, stat: WIS, schools: ["druid-arcane"]},
  {name: "toxic-moisture-iii", level: 33, fail: -70, stat: WIS, schools: ["druid-arcane"]},
  {name: "natures-call", level: 15, fail: -5, stat: WIS, schools: ["druid-arcane"]},
  {name: "ancient-lore", level: 20, fail: -10, stat: WIS, schools: ["druid-arcane"]},
  {name: "garden-of-the-gods", level: 35, fail: 102, stat: WIS, schools: ["druid-arcane"]},
  {name: "call-of-the-forest", level: 40, fail: 102, stat: WIS, schools: ["druid-arcane"]},
  {name: "focus-i", level: 1, fail: 0, stat: WIS, schools: ["druid-physical"]},
  {name: "focus-ii", level: 25, fail: -50, stat: WIS, schools: ["druid-physical"]},
  {name: "herbal-tea", level: 3, fail: 20, stat: WIS, schools: ["druid-physical"]},
  {name: "quickfeet", level: 13, fail: -10, stat: WIS, schools: ["druid-physical"]},
  {name: "extra-growth-i", level: 15, fail: -15, stat: WIS, schools: ["druid-physical"]},
  {name: "extra-growth-ii", level: 25, fail: -45, stat: WIS, schools: ["druid-physical"]},
  {name: "forests-embrace-i", level: 18, fail: -30, stat: WIS, schools: ["druid-physical"]},
  {name: "forests-embrace-ii", level: 29, fail: -60, stat: WIS, schools: ["druid-physical"]},
  {name: "forests-embrace-iii", level: 40, fail: -85, stat: WIS, schools: ["druid-physical"]},
  {name: "psychic-hammer", level: 1, fail: 5, stat: INT, schools: ["ppower"]},
  {name: "psychokinesis", level: 3, fail: 10, stat: INT, schools: ["ppower"]},
  {name: "autokinesis-i", level: 5, fail: 10, stat: INT, schools: ["ppower"]},
  {name: "autokinesis-ii", level: 16, fail: 20, stat: INT, schools: ["ppower"]},
  {name: "autokinesis-iii", level: 24, fail: 10, stat: INT, schools: ["ppower"]},
  {name: "feedback", level: 18, fail: 15, stat: INT, schools: ["ppower"]},
  {name: "pyrokinesis-i", level: 20, fail: -25, stat: INT, schools: ["ppower"]},
  {name: "pyrokinesis-ii", level: 37, fail: -85, stat: INT, schools: ["ppower"]},
  {name: "cryokinesis-i", level: 24, fail: -25, stat: INT, schools: ["ppower"]},
  {name: "cryokinesis-ii", level: 39, fail: -90, stat: INT, schools: ["ppower"]},
  {name: "psychic-warp", level: 30, fail: 10, stat: INT, schools: ["ppower"]},
  {name: "telekinesis-ii", level: 35, fail: -5, stat: INT, schools: ["attunement", "ppower"]},
  {name: "kinetic-shield", level: 40, fail: -50, stat: INT, schools: ["ppower"]},
  {name: "clear-mind", level: 3, fail: 5, stat: INT, schools: ["attunement"]},
  {name: "willpower", level: 3, fail: 5, stat: INT, schools: ["attunement"]},
  {name: "self-reflection", level: 15, fail: 20, stat: INT, schools: ["attunement"]},
  {name: "recognition", level: 15, fail: -5, stat: INT, schools: ["attunement", "mintrusion"]},
  {name: "accelerate-nerves", level: 20, fail: 1, stat: INT, schools: ["attunement"]},
  {name: "telepathy", level: 20, fail: 5, stat: INT, schools: ["attunement"]},
  {name: "stabilize-thoughts", level: 25, fail: 40, stat: INT, schools: ["attunement"]},
  {name: "psionic-blast-i", level: 1, fail: 10, stat: INT, schools: ["mintrusion"]},
  {name: "psionic-blast-ii", level: 20, fail: -30, stat: INT, schools: ["mintrusion"]},
  {name: "psionic-blast-iii", level: 40, fail: -95, stat: INT, schools: ["mintrusion"]},
  {name: "scare-i", level: 1, fail: 10, stat: INT, schools: ["mintrusion"]},
  {name: "scare-ii", level: 10, fail: -20, stat: INT, schools: ["mintrusion"]},
  {name: "confuse-i", level: 3, fail: 10, stat: INT, schools: ["mintrusion"]},
  {name: "confuse-ii", level: 14, fail: -20, stat: INT, schools: ["mintrusion"]},
  {name: "hypnosis-i", level: 5, fail: 10, stat: INT, schools: ["mintrusion"]},
  {name: "hypnosis-ii", level: 18, fail: -20, stat: INT, schools: ["mintrusion"]},
  {name: "apathy-i", level: 7, fail: 10, stat: INT, schools: ["mintrusion"]},
  {name: "apathy-ii", level: 22, fail: -20, stat: INT, schools: ["mintrusion"]},
  {name: "psychic-suppression", level: 10, fail: 10, stat: INT, schools: ["mintrusion"]},
  {name: "psi-storm-i", level: 18, fail: 5, stat: INT, schools: ["mintrusion"]},
  {name: "psi-storm-ii", level: 38, fail: -90, stat: INT, schools: ["mintrusion"]},
  {name: "remote-vision", level: 20, fail: 0, stat: INT, schools: ["mintrusion"]},
  {name: "charm-i", level: 33, fail: -60, stat: CHR, schools: ["mintrusion"]},
  {name: "charm-ii", level: 39, fail: -70, stat: CHR, schools: ["mintrusion"]},
  {name: "charm-iii", level: 45, fail: -93, stat: CHR, schools: ["mintrusion"]},
  {name: "stop-charm", level: 45, fail: 101, stat: INT, schools: ["mintrusion"]},
  {name: "power-bolt-i", level: 1, fail: 5, stat: INT, schools: ["astral"]},
  {name: "power-bolt-ii", level: 20, fail: -35, stat: INT, schools: ["astral"]},
  {name: "power-bolt-iii", level: 40, fail: -100, stat: INT, schools: ["astral"]},
  {name: "power-ray-i", level: 5, fail: 10, stat: INT, schools: ["astral"]},
  {name: "power-ray-ii", level: 20, fail: -30, stat: INT, schools: ["astral"]},
  {name: "power-ray-iii", level: 40, fail: -100, stat: INT, schools: ["astral"]},
  {name: "power-blast-i", level: 10, fail: 0, stat: INT, schools: ["astral"]},
  {name: "power-blast-ii", level: 25, fail: -50, stat: INT, schools: ["astral"]},
  {name: "power-blast-iii", level: 45, fail: -115, stat: INT, schools: ["astral"]},
  {name: "relocation", level: 22, fail: 10, stat: INT, schools: ["astral"]},
  {name: "vengeance", level: 30, fail: 102, stat: WIS, schools: ["astral"]},
  {name: "empowerment", level: 40, fail: 102, stat: WIS, schools: ["astral"]},
  {name: "the-silent-force", level: 45, fail: 102, stat: WIS, schools: ["astral"]},
  {name: "sphere-of-destruction", level: 50, fail: 102, stat: INT, schools: ["astral"]},
  {name: "gateway", level: 40, fail: 102, stat: WIS, schools: ["astral"]}
];

spellData.forEach((spell, index) => {
  individualOutputs[spell.name] = outputZone.lastElementChild.children[index].lastElementChild;
});

const statParser = {
  "three": 3,
  "four": 4,
  "five": 5,
  "six": 6,
  "seven": 7,
  "eight": 8,
  "nine": 9,
  "ten": 10,
  "eleven": 11,
  "twelve": 12,
  "thirteen": 13,
  "fourteen": 14,
  "fifteen": 15,
  "sixteen": 16,
  "seventeen": 17,
  "eighteen": 18,
  "eighteen-ten": 19,
  "eighteen-twenty": 20,
  "eighteen-thirty": 21,
  "eighteen-forty": 22,
  "eighteen-fifty": 23,
  "eighteen-sixty": 24,
  "eighteen-seventy": 25,
  "eighteen-eighty": 26,
  "eighteen-ninety": 27,
  "eighteen-one-hundred": 28,
  "eighteen-one-hundred-ten": 29,
  "eighteen-one-hundred-twenty": 30,
  "eighteen-one-hundred-thirty": 31,
  "eighteen-one-hundred-forty": 32,
  "eighteen-one-hundred-fifty": 33,
  "eighteen-one-hundred-sixty": 34,
  "eighteen-one-hundred-seventy": 35,
  "eighteen-one-hundred-eighty": 36,
  "eighteen-one-hundred-ninety": 37,
  "eighteen-two-hundred": 38,
  "eighteen-two-hundred-ten": 39,
  "eighteen-two-hundred-twenty": 40
};

const statNameParser = {
  "dexScore": DEX,
  "intScore": INT,
  "wisScore": WIS,
  "chaScore": CHR
};

/*
const patternSelector = {
  "magicSchoolSkill": /^([1-4]?\d(\.\d\d?\d?)?|50(.00?0?)?)$/
};
*/

const skillRegex = /^([1-4]?\d(\.\d\d?\d?)?|50(.00?0?)?)$/;

const getSuccessBonus = function(statValue) {
  return adjMagStat[statValue - STAT_TABLE_OFFSET] - 3;
}

const getMinFail = function(statValue) {
  return adjMagFail[statValue - STAT_TABLE_OFFSET];
}

const recompute = function(p, spell) {

  if (spell.fail == 101) return "0%";
  const isEasy = (spell.fail == 102);
  const effFail = isEasy ? 0 : spell.fail;

  const castingStat = p.abilityScores[spell.stat];
  const minFail = getMinFail(castingStat);
  const schoolSkills = spell.schools.map(sch => Math.floor(p.magicSchoolSkills[sch]));
  const combinedSkill = Math.floor(schoolSkills.reduce((acc, cur) => acc + cur, 0) / schoolSkills.length);
  if (combinedSkill < spell.level) return "-";

  const baseFail = effFail - 3 * (combinedSkill - 2 * spell.level + 1) - getSuccessBonus(castingStat);
  const failAfterFloor = (baseFail > minFail) ? baseFail : minFail;
  const failAfterCap = failAfterFloor < 95 ? failAfterFloor : 95;

  const finalFail = isEasy ? Math.floor((failAfterCap + 5) / 6) : failAfterCap;

  return finalFail + "%";

};

const displayValueIn = function(value, container) {
  container.textContent = value;
}

const clearDisplay = function(container) {
  container.textContent = "";
}

const updateOutput = function() {
  const sch = profile.currentSchool;
  document.body.setAttribute("displaying", sch);
  spellData.forEach(spell => {
    if (spell.schools.includes(sch)) {
      displayValueIn(recompute(profile, spell), individualOutputs[spell.name]);
    }
  });
};

updateOutput();

allInputs.addEventListener('change', e => {
  const changedFieldID = e.target.id;
  const changedFieldType = e.target.type;
  const changedFieldValue = e.target.value;
  if (changedFieldType === 'select-one') {
    if (changedFieldID === 'spellSchool') {
      // TODO: disappear the current school's table
      profile.currentSchool = changedFieldValue;
      // TODO: appear the current school's table
      schoolSkillInput.value = profile.magicSchoolSkills[profile.currentSchool];
      for (let i = 0; i < 4; i++) {
        if (schoolsData[profile.currentSchool].stats.includes(i)) {
          statInputs[i].removeAttribute("hidden"); // We need to see Cha on for Mental Intrusion...
        } else {
          statInputs[i].setAttribute("hidden", ""); // but we don't need to see it for Fire!
        }
      }
      // TODO: also appear and disappear the shared schools
    } else {
      const statIndex = statNameParser[changedFieldID];
      const statValue = statParser[changedFieldValue];
      profile.abilityScores[statIndex] = statValue;
    }
  } else {
    console.log(changedFieldType);
    console.log(changedFieldValue);
  }
  updateOutput();
});

allInputs.addEventListener('input', e => {
  const changedFieldID = e.target.id;
  if (e.target.type === 'text') {
    const inputString = e.target.value;
    const validInput = skillRegex.test(inputString);
    if (validInput) {
      e.target.removeAttribute("invalid");
      if (changedFieldID === "magicSchoolSkill") {
        profile.magicSchoolSkills[profile.currentSchool] = Number(inputString);
        if (schoolsThatShare.includes(profile.currentSchool)) {
          sharedSchoolInputs[profile.currentSchool].value = inputString;
        }
      } else if (changedFieldID.startsWith("shared-")) {
        profile.magicSchoolSkills[changedFieldID.slice(7)] = Number(inputString);
      } else {
        profile[changedFieldID] = Number(inputString);
      }
    } else {
      e.target.setAttribute("invalid", "");
    }
  }
  updateOutput();
});
