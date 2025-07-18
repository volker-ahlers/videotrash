import { Bbox, IGate, IMessage } from '../types';
// Mock data
export const mockMessage1: IMessage = {
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

export const mockGate1: IGate = {
    name: 'Gate A',
    sortNr: 1,
    messages: [mockMessage1],
};

export const mockGate2: IGate = {
    name: 'Gate B',
    sortNr: 2,
    messages: [],
};
