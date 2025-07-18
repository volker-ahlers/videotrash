import { TestBed } from '@angular/core/testing';
import { mockGate1, mockGate2 } from '../more/mock/mocks';
import { MessageService } from './message.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MessageService', () => {
    let service: MessageService;

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
