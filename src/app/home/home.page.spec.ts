import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';

// Unit tests for the HomePage component
//
// This test suite verifies:
// - Component creation
//
// The test uses Angular's TestBed to create the component and check its instantiation.

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  // Set up the testing module before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test that the HomePage component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
