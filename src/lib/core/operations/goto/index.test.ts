import { describe, it, expect, vi, beforeEach } from 'vitest';
import { goto } from './index.js';
import { utils } from '@/lib/index.js';
import * as navigation from '$app/navigation';
import * as environment from '$app/environment';
import type { Context } from '@/lib/core/contracts.js';
import { createContext } from '@/lib/core/context/index.js';
import type { Application } from '@/lib/core/app/index.js';
import { createApp } from '@/lib/index.js';
import * as sveltekit from '@sveltejs/kit';

describe('goto operation', () => {
    let context: Context;
    let app: Application;

    beforeEach(() => {
        context = createContext();
        app = createApp();
        app.config({ redirect: sveltekit.redirect, error: sveltekit.error });

        vi.spyOn(utils, 'compile');
        vi.spyOn(navigation, 'goto').mockResolvedValue(undefined);
        vi.spyOn(sveltekit, 'redirect');
        Object.defineProperty(environment, 'browser', { value: true });
        Object.defineProperty(window, 'location', {
            value: { href: '' },
            writable: true,
        });
    });

    it('should throw error if route is not a string', () => {
        expect(() => goto(123, { context, app })).toThrow('Goto operation requires a string argument');
    });

    it('should compile route with context data', () => {
        context.set('username', 'johndoe');
        goto('/users/${username}', { context, app });
        expect(utils.compile).toHaveBeenCalledWith('/users/${username}', context.data);
        expect(navigation.goto).toHaveBeenCalledWith(`/users/${context.data.username}`);
    });

    it("should use sveltekit's navigation.goto for internal routes in browser", () => {
        goto('/dashboard', { context, app });
        expect(navigation.goto).toHaveBeenCalledWith('/dashboard');
    });

    it('should redirect using window.location.href for external URLs in browser', () => {
        goto('https://example.com', { context, app });
        expect(window.location.href).toBe('https://example.com');
        expect(navigation.goto).not.toHaveBeenCalled();
    });

    it('should use app.redirect for server-side navigation', () => {
        Object.defineProperty(environment, 'browser', { value: false });
        vi.spyOn(app, 'redirect');
        expect(() => goto('/dashboard', { context, app })).toThrow();
        expect(app.redirect).toHaveBeenCalledWith(302, '/dashboard');
    });

    it('should handle compiled routes with query parameters', () => {
        context.set('query', 'test');
        goto('/search?q=${query}', { context, app });
        expect(navigation.goto).toHaveBeenCalledWith('/search?q=test');
    });

    it('should handle compiled routes that become external URLs', () => {
        context.set('apiUrl', 'https://api.example.com');
        goto('${apiUrl}/data', { context, app });
        expect(window.location.href).toBe('https://api.example.com/data');
    });

    it('should call app.redirect for server-side navigation with external URLs', () => {
        Object.defineProperty(environment, 'browser', { value: false });
        vi.spyOn(app, 'redirect');
        context.set('apiUrl', 'https://api.example.com');
        expect(() => goto('${apiUrl}/data', { context, app })).toThrow();
        expect(app.redirect).toHaveBeenCalledWith(302, 'https://api.example.com/data');
    });
});
