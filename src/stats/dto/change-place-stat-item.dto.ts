export class ChangePlaceStatItemDto {
  readonly placeId: string;
  readonly title: string;
  readonly type: 'inc' | 'dec';
}
