import * as _ from 'lodash';

import IGene from './lib/IGene';
import { Organism } from './lib/Organism';
import Population from './lib/Population';

const target = 'To be or not to be';
const populationSize = 200;
const mutationRate = 0.01;

class CharGene implements IGene {
	public static charSet = 'ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz. '.split('');

	public readonly value: string;

	constructor() {
		this.value = _.sample(CharGene.charSet);
	}
}
// tslint:disable-next-line: max-classes-per-file
class PhraseOrganism extends Organism {
	protected calculateFitness(): number {
		return this.genes.reduce((fitness, gene, i) => {
			if (target.charAt(i) !== gene.value) {
				return fitness;
			}
			return fitness + 1;
		}, 0);
	}

	protected getRandomGene(): IGene {
		return new CharGene();
	}
}

const organismSize = target.length;

const p = new Population(PhraseOrganism, organismSize, populationSize, mutationRate);

function tick() {
	// selection
	p.updateFitness();

	console.log(`
		generation: ${p.generations}
		best: ${p.best}
		average fitness: ${p.averageFitness}
	`);

	if (p.best.toString() === target) {
		// we have reached max fitness
		process.exit(0);
	}

	// reproduction
	p.reproduce();
}

setInterval(tick, 20);
