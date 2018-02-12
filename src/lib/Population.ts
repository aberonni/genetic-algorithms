import * as _ from 'lodash';

import { Organism, OrganismConstructor } from './Organism';
import IGene from './IGene';

export default class Population {
	public generations: number;
	public complete: boolean;
	public averageFitness: number;
	public best: Organism;

	private population: Organism[] = [];
	private totalFitness: number;

	private Species: OrganismConstructor;
	private size: number;
	private mutationRate: number;

	constructor(
		Species: OrganismConstructor,
		speciesSize: number,
		size: number,
		mutationRate: number
	) {
		this.Species = Species;
		this.size = size;
		this.mutationRate = mutationRate;

		for (let i = 0; i < size; i++) {
			this.population[i] = new this.Species(speciesSize);
		}

		this.generations = 1;
		this.complete = false;

		this.averageFitness = 0;
	}

	public updateFitness() {
		this.totalFitness = 0;
		let bestOrganism: Organism;

		this.population.forEach((organism) => {
			organism.updateFitness();

			this.totalFitness += organism.fitness;

			if (!bestOrganism || organism.fitness > bestOrganism.fitness) {
				bestOrganism = organism;
			}

			console.log(organism.toString());
		});

		this.best = bestOrganism;

		this.averageFitness = this.totalFitness / this.size;
	}

	public reproduce() {
		const newPopulation = [];

		for (let i = 0; i < this.size; i++) {
			// pick two parents
			const partnerA = this.weightedRandom();
			const partnerB = this.weightedRandom();
			// crossover
			const childGenes = partnerA.crossover(partnerB);
			const child = new this.Species(childGenes.length, childGenes);
			// mutation
			child.mutate(this.mutationRate);
			// add child to population
			newPopulation[i] = child;
		}

		this.population = newPopulation;

		this.generations++;
	}

	private weightedRandom(): Organism {
		let r = Math.random() * this.totalFitness;

		for (let i = 0; i < this.size; i++) {
			r -= this.population[i].fitness;

			if (r <= 0) {
				return this.population[i];
			}
		}
	}
}
