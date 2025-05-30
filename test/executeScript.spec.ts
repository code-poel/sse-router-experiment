import { describe, it, expect } from 'vitest';
import executeScript from '../src/events/datastar/executeScript';
import repeatingEvent from '../src/events/recurring';

describe('executeScript', () => {
  it('creates a basic execute script event', () => {
    const event = executeScript({
      scripts: ['console.log("test")'],
      attributes: []
    });

    expect(event.type).toBe('datastar-execute-script');
    expect(event.format()).toContain('event: datastar-execute-script');
    expect(event.format()).toContain('data: script console.log("test")');
  });

  it('handles multiple scripts', () => {
    const event = executeScript({
      scripts: [
        'console.log("first")',
        'console.log("second")'
      ],
      attributes: []
    });

    const format = event.format();
    expect(format).toContain('data: script console.log("first")');
    expect(format).toContain('data: script console.log("second")');
  });

  it('includes optional autoRemove flag', () => {
    const event = executeScript({
      scripts: ['console.log("test")'],
      autoRemove: true,
      attributes: []
    });

    expect(event.format()).toContain('data: autoRemove true');
  });

  it('includes optional attributes', () => {
    const event = executeScript({
      scripts: ['console.log("test")'],
      attributes: [
        { name: 'type', value: 'module' },
        { name: 'defer', value: true }
      ]
    });

    const format = event.format();
    expect(format).toContain('data: attributes type module');
    expect(format).toContain('data: attributes defer true');
  });

  it('handles retry field correctly', () => {
    // Test with retry specified
    const eventWithRetry = executeScript({
      scripts: ['console.log("test")'],
      attributes: [],
      retry: 5000
    });

    expect(eventWithRetry.format()).toContain('retry: 5000');

    // Test without retry specified
    const eventWithoutRetry = executeScript({
      scripts: ['console.log("test")'],
      attributes: []
    });

    expect(eventWithoutRetry.format()).not.toContain('retry:');

    // Test with retry explicitly set to null
    const eventWithNullRetry = executeScript({
      scripts: ['console.log("test")'],
      attributes: [],
      retry: null
    });

    expect(eventWithNullRetry.format()).not.toContain('retry:');
  });

  it('works with repeating events', () => {
    const event = executeScript({
      scripts: ['console.log("test")'],
      attributes: []
    });

    const repeating = repeatingEvent(event, 1000);
    expect(repeating._repeating).toBeDefined();
    expect(repeating._repeating?.frequency).toBe(1000);
    expect(repeating._repeating?.originalEvent).toBe(event);
  });
}); 