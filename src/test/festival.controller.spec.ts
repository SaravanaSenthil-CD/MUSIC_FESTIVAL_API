import { Test, TestingModule } from '@nestjs/testing';
import { FestivalController } from '../controllers/festival.controller';
import { FestivalService } from '../services/festival.service';

describe('FestivalController', () => {
  let controller: FestivalController;
  let service: FestivalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FestivalController],
      providers: [
        {
          provide: FestivalService,
          useValue: {
            fetchAndSortFestivals: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FestivalController>(FestivalController);
    service = module.get<FestivalService>(FestivalService);
  });

  describe('fetchAndStoreFestivals', () => {
    it('should return a success message and data when fetching is successful', async () => {
      const mockData = [
        {
          label: 'Record Label 1',
          bands: [
            {
              name: 'Band X',
              festivals: [
                {
                  name: 'Omega Festival',
                },
              ],
            },
          ],
        },
        {
          label: 'Record Label 2',
          bands: [
            {
              name: 'Band A',
              festivals: [
                {
                  name: 'Alpha Festival',
                },
                {
                  name: 'Beta Festival',
                },
              ],
            },
          ],
        },
      ];

      jest
        .spyOn(service, 'fetchAndSortFestivals')
        .mockResolvedValueOnce(mockData);

      const result = await controller.fetchAndStoreFestivals();

      expect(result).toEqual({
        message: 'Data fetched and sorted successfully',
        data: mockData,
      });
    });

    it('should throw an error when fetching fails', async () => {
      jest
        .spyOn(service, 'fetchAndSortFestivals')
        .mockRejectedValueOnce(new Error('Service error'));

      await expect(controller.fetchAndStoreFestivals()).rejects.toThrow(
        'Failed to fetch and sort alphabetically the festivals data',
      );
    });
  });
});
