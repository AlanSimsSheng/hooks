import { act, renderHook, RenderHookResult } from '@testing-library/react-hooks';
import useAsyncState from '../index';

describe('useSetState', () => {
  it('should be defined', () => {
    expect(useAsyncState).toBeDefined();
  });

  const setUp = (initialValue: any) =>
    renderHook(() => {
      const [state, setState] = useAsyncState(initialValue);
      return {
        state,
        setState,
      } as const;
    });

  it('should support initialValue', () => {
    const hook = setUp({
      hello: 'world',
    });
    expect(hook.result.current.state).toEqual({ hello: 'world' });
  });

  it('should support update', () => {
    const hook = setUp(0);
    act(() => {
      hook.result.current.setState(5);
    });
    expect(hook.result.current.state).toEqual(5);
  });

  it('should not support update when unmount', () => {
    const hook = setUp(0);
    hook.unmount();
    act(() => {
      hook.result.current.setState(5);
    });
    expect(hook.result.current.state).toEqual(0);
  });
});
