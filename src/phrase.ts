import * as _ from 'lodash';

import Organism from './lib/Organism';
import Population from './lib/Population';

const target = 'To be or not to be';
const populationSize = 200;
const mutationRate = 0.01;

const charSet = 'ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz. '.split('');

// used to generate genes randomly
function randomGene() {
	return _.sample(charSet);
}

// used to calculate the fitness of a gene set
function calculateFitness(genes) {
	return genes.reduce((fitness, gene, i) => {
		if (target.charAt(i) !== gene) {
			return fitness;
		}
		return fitness + 1;
	}, 0);
}

const organisms = [];

for (let i = 0; i < populationSize; i++) {
	organisms[i] = new Organism(target.length, randomGene, calculateFitness);
}

const p = new Population(organisms, mutationRate, target.length);

function tick() {
	// selection
	p.updateFitness();

	console.log(`
		generation: ${p.generations}
		best: ${p.best}
		average fitness: ${p.averageFitness}
	`);

	if (p.complete) {
		process.exit(0);
	}

	// reproduction
	p.reproduce();
}

setInterval(tick, 20);
