export interface Recipe {
    id: string;
    authorId: string;
    title: string;
    shortDescription: string;
    prepTimeMinutes: number;
    ingredients: string[];
    imageUrl: string;
    description: string;
    tags: string[];
    creationDate: string;
    lastModifiedDate: string;
}