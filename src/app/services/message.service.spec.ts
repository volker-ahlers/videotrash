import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Bbox, IGate, IMessage } from '../more/types';
describe('MessageService', () => {
    let service: MessageService;

    // Mock data
    const mockMessage1: IMessage = {
        message_id: 'msg1',
        sensor_id: 1,
        sensor_label: 'Sensor 1',
        mds_version: 'v1',
        frame_id: 100,
        image_path: '/img1.jpg',
        timestamp: '2023-01-01T00:00:00Z',
        buf_pts: 123456,
        state: 'active',
        object: {
            label_id: 0,
            label: '',
            confidence: 0,
            bbox: new Bbox(),
        },
        step: 1,
        category: 'A',
        lpn: 'ABC123',
    };

    const mockGate1: IGate = {
        name: 'Gate A',
        sortNr: 1,
        messages: [mockMessage1],
    };

    const mockGate2: IGate = {
        name: 'Gate B',
        sortNr: 2,
        messages: [],
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(MessageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize with empty gate array', () => {
        expect(service.messagesArrayForCockpit().length).toBe(0);
    });

    it('should replace the current gate array with new gates', () => {
        service.setMessagesArrayForCockpit([mockGate1, mockGate2]);
        const result = service.messagesArrayForCockpit();

        expect(result.length).toBe(2);
        expect(result[0]).toEqual(mockGate1);
        expect(result[1]).toEqual(mockGate2);
    });

    describe('addMessagesToArrayForCockpit()', () => {
        it('should append a new gate to the existing array', () => {
            // Set initial state
            service.setMessagesArrayForCockpit([mockGate1]);

            // Add new gate
            service.addMessagesToArrayForCockpit(mockGate2);
            const result = service.messagesArrayForCockpit();

            expect(result.length).toBe(2);
            expect(result[0]).toEqual(mockGate1);
            expect(result[1]).toEqual(mockGate2);
        });

        it('should handle appending to an empty array', () => {
            service.addMessagesToArrayForCockpit(mockGate1);
            const result = service.messagesArrayForCockpit();

            expect(result.length).toBe(1);
            expect(result[0]).toEqual(mockGate1);
        });
    });
});
