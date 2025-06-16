import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageComponent } from './message.component';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MessageComponent],
      providers: [
        provideHttpClient(), // HttpClient bereitstellen
        provideHttpClientTesting(), // Test-Umgebung für HttpClient bereitstellen
      ],
    });
    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return "ok", if confidence > 0.9', () => {
    // Arrange
    component.message.object = { confidence: 0.95 } as any; // Mock the object structure
    // Act
    const result = component.getObjectColor();
    // Assert
    expect(result).toBe('ok');
  });
  it('should return "alarm", if confidence =< 0.9', () => {
    // Arrange
    component.message.object = { confidence: 0.9 } as any; // Mock the object structure
    // Act
    const result = component.getObjectColor();
    // Assert
    expect(result).toBe('alarm');
  });
  it('should return "alarm", if confidence < 0.9', () => {
    // Arrange
    component.message.object = { confidence: 0.8 } as any; // Mock the object structure
    // Act
    const result = component.getObjectColor();
    // Assert
    expect(result).toBe('alarm');
  });
});
