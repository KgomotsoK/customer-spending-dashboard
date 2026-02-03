import { act, renderHook } from '@testing-library/react';
import { reducer, toast, useToast } from '../use-toast';

// Mock timers for toast removal
jest.useFakeTimers();

describe('Toast System', () => {
  beforeEach(() => {
    // Reset toast state before each test
    act(() => {
      const { result } = renderHook(() => useToast());
      result.current.dismiss(); // Dismiss all toasts
    });
    jest.clearAllTimers();
  });

  describe('toast function', () => {
    it('should create a toast with default options', () => {
      const toastResult = toast({ title: 'Test Toast' });

      expect(toastResult).toHaveProperty('id');
      expect(toastResult).toHaveProperty('dismiss');
      expect(toastResult).toHaveProperty('update');
      expect(toastResult.id).toBeDefined();
    });

    it('should create a toast with custom id', () => {
      const customId = 'custom-toast-id';
      const toastResult = toast({ title: 'Test Toast', id: customId });

      expect(toastResult.id).toBe(customId);
    });

    it('should create a toast with description', () => {
      const toastResult = toast({
        title: 'Success',
        description: 'Operation completed successfully'
      });

      expect(toastResult).toBeDefined();
    });

    it('should create a toast with variant', () => {
      const toastResult = toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive'
      });

      expect(toastResult).toBeDefined();
    });

    it('should create a toast with duration', () => {
      const toastResult = toast({
        title: 'Notification',
        duration: 5000
      });

      expect(toastResult).toBeDefined();
    });

    it('should limit number of toasts to TOAST_LIMIT', () => {
      const { result } = renderHook(() => useToast());

      // Create more toasts than the limit
      for (let i = 0; i < 5; i++) {
        toast({ title: `Toast ${i}` });
      }

      act(() => {
        // Force state update
      });

      expect(result.current.toasts.length).toBeLessThanOrEqual(1); // TOAST_LIMIT = 1
    });
  });

  describe('useToast hook', () => {
    it('should provide toast state and functions', () => {
      const { result } = renderHook(() => useToast());

      expect(result.current.toasts).toEqual([]);
      expect(typeof result.current.toast).toBe('function');
      expect(typeof result.current.dismiss).toBe('function');
    });

    it('should add toast to state', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: 'New Toast' });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('New Toast');
      expect(result.current.toasts[0].open).toBe(true);
    });

    it('should dismiss a specific toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: 'Toast 1', id: 'toast1' });
        result.current.toast({ title: 'Toast 2', id: 'toast2' });
      });

      expect(result.current.toasts).toHaveLength(1); // Only one due to limit

      act(() => {
        result.current.dismiss('toast1');
      });

      // Toast should be marked as closed
      const toast = result.current.toasts.find(t => t.id === 'toast1');
      expect(toast.open).toBe(false);
    });

    it('should dismiss all toasts', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: 'Toast 1' });
        result.current.toast({ title: 'Toast 2' });
      });

      expect(result.current.toasts.length).toBeGreaterThan(0);

      act(() => {
        result.current.dismiss();
      });

      // All toasts should be marked as closed
      result.current.toasts.forEach(toast => {
        expect(toast.open).toBe(false);
      });
    });

    it('should update an existing toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: 'Original Title', id: 'toast1' });
      });

      expect(result.current.toasts[0].title).toBe('Original Title');

      act(() => {
        result.current.toast({ title: 'Updated Title', id: 'toast1' });
      });

      expect(result.current.toasts[0].title).toBe('Updated Title');
    });

    it('should remove toast after delay', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: 'Temporary Toast' });
      });

      expect(result.current.toasts).toHaveLength(1);

      // Fast-forward time past the removal delay
      act(() => {
        jest.advanceTimersByTime(1000001); // TOAST_REMOVE_DELAY + 1
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should handle onOpenChange callback', () => {
      const onOpenChange = jest.fn();
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({
          title: 'Test Toast',
          onOpenChange
        });
      });

      // Trigger onOpenChange with false
      act(() => {
        result.current.toasts[0].onOpenChange(false);
      });

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('reducer function', () => {
    it('should handle ADD_TOAST action', () => {
      const initialState = { toasts: [] };
      const action = {
        type: 'ADD_TOAST',
        toast: { id: '1', title: 'Test Toast' }
      };

      const newState = reducer(initialState, action);

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe('1');
      expect(newState.toasts[0].title).toBe('Test Toast');
    });

    it('should handle UPDATE_TOAST action', () => {
      const initialState = {
        toasts: [
          { id: '1', title: 'Old Title', description: 'Old Desc' }
        ]
      };
      const action = {
        type: 'UPDATE_TOAST',
        toast: { id: '1', title: 'New Title' }
      };

      const newState = reducer(initialState, action);

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].title).toBe('New Title');
      expect(newState.toasts[0].description).toBe('Old Desc'); // Should preserve unchanged fields
    });

    it('should handle DISMISS_TOAST action for specific toast', () => {
      const initialState = {
        toasts: [
          { id: '1', title: 'Toast 1', open: true },
          { id: '2', title: 'Toast 2', open: true }
        ]
      };
      const action = {
        type: 'DISMISS_TOAST',
        toastId: '1'
      };

      const newState = reducer(initialState, action);

      expect(newState.toasts[0].open).toBe(false);
      expect(newState.toasts[1].open).toBe(true);
    });

    it('should handle DISMISS_TOAST action for all toasts', () => {
      const initialState = {
        toasts: [
          { id: '1', title: 'Toast 1', open: true },
          { id: '2', title: 'Toast 2', open: true }
        ]
      };
      const action = {
        type: 'DISMISS_TOAST'
      };

      const newState = reducer(initialState, action);

      newState.toasts.forEach(toast => {
        expect(toast.open).toBe(false);
      });
    });

    it('should handle REMOVE_TOAST action for specific toast', () => {
      const initialState = {
        toasts: [
          { id: '1', title: 'Toast 1' },
          { id: '2', title: 'Toast 2' }
        ]
      };
      const action = {
        type: 'REMOVE_TOAST',
        toastId: '1'
      };

      const newState = reducer(initialState, action);

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe('2');
    });

    it('should handle REMOVE_TOAST action for all toasts', () => {
      const initialState = {
        toasts: [
          { id: '1', title: 'Toast 1' },
          { id: '2', title: 'Toast 2' }
        ]
      };
      const action = {
        type: 'REMOVE_TOAST'
      };

      const newState = reducer(initialState, action);

      expect(newState.toasts).toHaveLength(0);
    });

    it('should limit toasts to TOAST_LIMIT when adding', () => {
      const initialState = {
        toasts: [
          { id: '1', title: 'Existing Toast' }
        ]
      };
      const action = {
        type: 'ADD_TOAST',
        toast: { id: '2', title: 'New Toast' }
      };

      const newState = reducer(initialState, action);

      expect(newState.toasts).toHaveLength(1); // Should replace existing due to limit
      expect(newState.toasts[0].id).toBe('2');
    });
  });

  describe('Toast lifecycle', () => {
    it('should generate unique IDs', () => {
      const toast1 = toast({ title: 'Toast 1' });
      const toast2 = toast({ title: 'Toast 2' });

      expect(toast1.id).not.toBe(toast2.id);
    });

    it('should allow updating a toast', () => {
      const toastInstance = toast({ title: 'Initial' });

      act(() => {
        toastInstance.update({ title: 'Updated' });
      });

      const { result } = renderHook(() => useToast());
      const updatedToast = result.current.toasts.find(t => t.id === toastInstance.id);
      
      expect(updatedToast.title).toBe('Updated');
    });

    it('should allow dismissing a toast', () => {
      const toastInstance = toast({ title: 'Test Toast' });

      act(() => {
        toastInstance.dismiss();
      });

      const { result } = renderHook(() => useToast());
      const dismissedToast = result.current.toasts.find(t => t.id === toastInstance.id);
      
      expect(dismissedToast.open).toBe(false);
    });

    it('should automatically dismiss after duration', () => {
      const shortDuration = 1000;
      toast({ title: 'Short Toast', duration: shortDuration });

      const { result } = renderHook(() => useToast());

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].open).toBe(true);

      // Fast-forward past duration
      act(() => {
        jest.advanceTimersByTime(shortDuration + 100);
      });

      // Toast should be marked as closed
      expect(result.current.toasts[0].open).toBe(false);
    });
  });
});