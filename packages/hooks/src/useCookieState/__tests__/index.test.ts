import { renderHook, act } from '@testing-library/react';
import useCookieState from '../index';
import type { Options } from '../index';
import Cookies from 'js-cookie';

describe('useCookieState', () => {
  const setUp = (key: string, options: Options) =>
    renderHook(() => {
      const [state, setState] = useCookieState(key, options);
      return {
        state,
        setState,
      } as const;
    });

  it('getKey should work', () => {
    const COOKIE_KEY = 'test-key';
    const hook = setUp(COOKIE_KEY, {
      defaultValue: 'A',
    });
    expect(hook.result.current.state).toBe('A');
    act(() => {
      hook.result.current.setState('B');
    });
    expect(hook.result.current.state).toBe('B');
    const anotherHook = setUp(COOKIE_KEY, {
      defaultValue: 'A',
    });
    expect(anotherHook.result.current.state).toBe('B');
    act(() => {
      anotherHook.result.current.setState('C');
    });
    expect(anotherHook.result.current.state).toBe('C');
    expect(hook.result.current.state).toBe('B');
  });

  it('should support undefined', () => {
    const COOKIE_KEY = 'test-boolean-key-with-undefined';
    const hook = setUp(COOKIE_KEY, {
      defaultValue: 'undefined',
    });
    expect(hook.result.current.state).toBe('undefined');
    act(() => {
      hook.result.current.setState(undefined);
    });
    expect(hook.result.current.state).toBeUndefined();
    const anotherHook = setUp(COOKIE_KEY, {
      defaultValue: 'false',
    });
    expect(anotherHook.result.current.state).toBe('false');
  });

  it('should support empty string', () => {
    Cookies.set('test-key-empty-string', '');
    expect(Cookies.get('test-key-empty-string')).toBe('');
    const COOKIE_KEY = 'test-key-empty-string';
    const hook = setUp(COOKIE_KEY, {
      defaultValue: 'hello',
    });
    expect(hook.result.current.state).toBe('');
  });

  it('should support function updater', () => {
    const COOKIE_KEY = 'test-func-updater';
    const hook = setUp(COOKIE_KEY, {
      defaultValue: () => 'hello world',
    });
    expect(hook.result.current.state).toBe('hello world');
    act(() => {
      hook.result.current.setState((state) => `${state}, zhangsan`);
    });
    expect(hook.result.current.state).toBe('hello world, zhangsan');
  });

  it('should set right value when batch updates', () => {
    const COOKIE_KEY = 'test-batch-updates';
    const hook = setUp(COOKIE_KEY, { defaultValue: 'A' });
    expect(hook.result.current.state).toBe('A');

    act(() => {
      // Batch updates
      hook.result.current.setState(hook.result.current.state + 'B');
      hook.result.current.setState(hook.result.current.state + 'C');
    });
    expect(hook.result.current.state).toBe('AC');

    act(() => {
      // Restore default
      hook.result.current.setState('A');

      // Non-batch updates
      hook.result.current.setState((prev) => prev + 'B');
      hook.result.current.setState((prev) => prev + 'C');
    });
    expect(hook.result.current.state).toBe('ABC');
  });
});
