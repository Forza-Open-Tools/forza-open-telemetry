import { LapColorClasses } from './types';

const colors = [
  'blue',
  'red',
  'yellow',
  'teal',
  'violet',
  'orange',
  'cyan',
  'indigo',
  'green',
  'pink',
];

const shades = [
  500,
  700,
  300,
];

function generateColorClasses(prefix: string) {
  return shades.reduce((acc, shade) => [
    ...acc,
    ...colors.map((color) => `${prefix}-${color}-${shade}`),
  ], [] as string[]);
}

const lapColorClasses = {
  stroke: generateColorClasses('stroke'),
  bg: generateColorClasses('bg'),
};

// console.log(JSON.stringify(lapColorClasses));

export function getLapColorClass(lapNumber: number): LapColorClasses {
  const index = (lapNumber - 1) % lapColorClasses.stroke.length;
  return {
    bg: lapColorClasses.bg[index],
    stroke: lapColorClasses.stroke[index],
  };
}

const colorsForTailwind = {
  stroke: [
    'stroke-green-700',
    'stroke-blue-700',
    'stroke-red-700',
    'stroke-yellow-700',
    'stroke-teal-700',
    'stroke-violet-700',
    'stroke-orange-700',
    'stroke-cyan-700',
    'stroke-indigo-700',
    'stroke-pink-700',
    'stroke-green-500',
    'stroke-blue-500',
    'stroke-red-500',
    'stroke-yellow-500',
    'stroke-teal-500',
    'stroke-violet-500',
    'stroke-orange-500',
    'stroke-cyan-500',
    'stroke-indigo-500',
    'stroke-pink-500',
    'stroke-green-300',
    'stroke-blue-300',
    'stroke-red-300',
    'stroke-yellow-300',
    'stroke-teal-300',
    'stroke-violet-300',
    'stroke-orange-300',
    'stroke-cyan-300',
    'stroke-indigo-300',
    'stroke-pink-300'
  ],
  bg: [
    'bg-green-700',
    'bg-blue-700',
    'bg-red-700',
    'bg-yellow-700',
    'bg-teal-700',
    'bg-violet-700',
    'bg-orange-700',
    'bg-cyan-700',
    'bg-indigo-700',
    'bg-pink-700',
    'bg-green-500',
    'bg-blue-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500',
    'bg-violet-500',
    'bg-orange-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-green-300',
    'bg-blue-300',
    'bg-red-300',
    'bg-yellow-300',
    'bg-teal-300',
    'bg-violet-300',
    'bg-orange-300',
    'bg-cyan-300',
    'bg-indigo-300',
    'bg-pink-300'
  ]
};
