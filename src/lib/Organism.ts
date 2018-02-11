import IGene from './IGene';

class Organism {
	public fitness: number;
	public weight: number;

	private size: number;
	private geneClass: { new(): IGene };
	private calculateFitness: (genes: IGene[]) => number;
	private genes: IGene[];

	constructor(
		size: number,
		geneClass: { new(): IGene },
		calculateFitness: (genes: IGene[]) => number,
		genes: IGene[] = null
	) {
		this.size = size;
		this.geneClass = geneClass;
		this.calculateFitness = calculateFitness;

		this.fitness = 0;

		if (!genes) {
			this.genes = [];

			for (let i = 0; i < size; i++) {
				this.genes[i] = this.getRandomGene();
			}
		} else {
			this.genes = genes;
		}
	}

	public toString(): string {
		return this.genes.map((g) => g.value).join('');
	}

	public updateFitness(): void {
		this.fitness = this.calculateFitness(this.genes);
	}

	public crossover(partner: Organism): Organism {
		const genes = [];

		for (let i = 0; i < this.size; i++) {
			if (Math.random() >= 0.5) {
				genes[i] = this.genes[i];
			} else {
				genes[i] = partner.genes[i];
			}
		}

		return new Organism(this.size, this.geneClass, this.calculateFitness, genes);
	}

	public mutate(mutationRate: number): void {
		for (let i = 0; i < this.size; i++) {
			if (Math.random() < mutationRate) {
				this.genes[i] = this.getRandomGene();
			}
		}
	}

	private getRandomGene(): IGene {
		return new this.geneClass();
	}
}

export default Organism;
