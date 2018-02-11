import IGene from './IGene';

export default abstract class Organism {
	public fitness: number;
	public genes: IGene[];

	protected size: number;

	constructor(
		size: number,
		genes: IGene[] = null
	) {
		this.size = size;

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
		this.fitness = this.calculateFitness();
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

		return this.fromGenes(genes);
	}

	public mutate(mutationRate: number): void {
		for (let i = 0; i < this.size; i++) {
			if (Math.random() < mutationRate) {
				this.genes[i] = this.getRandomGene();
			}
		}
	}

	protected abstract getRandomGene(): IGene;
	protected abstract calculateFitness(): number;
	protected abstract fromGenes(genes: IGene[]): Organism;
}
