import { TestBed } from '@angular/core/testing';
import { I18nService } from '../../i18n/i18n.service';
import { RenderedContent } from './rendered-content';

describe('RenderedContent', () => {
  const render = async (html: string) => {
    const fixture = TestBed.createComponent(RenderedContent);
    fixture.componentRef.setInput('html', html);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  it('should show the generated HTML with the attributes the content relies on', async () => {
    const element = await render(
      '<h2 id="rules">Rules</h2>' +
        '<pre class="code-block" dir="ltr"><code class="language-powershell">node --version</code></pre>' +
        '<div class="table-wrap" tabindex="0"><table><tr><td>1</td></tr></table></div>' +
        '<ul class="task-list"><li class="task-list-item"><input class="task-checkbox" type="checkbox" disabled checked> Done</li></ul>',
    );

    expect(element.querySelector('h2')?.id).toBe('rules');
    expect(element.querySelector('pre')?.getAttribute('dir')).toBe('ltr');
    expect(element.querySelector('.table-wrap')?.getAttribute('tabindex')).toBe('0');
    const checkbox = element.querySelector<HTMLInputElement>('input.task-checkbox')!;
    expect(checkbox.disabled).toBe(true);
    expect(checkbox.checked).toBe(true);
  });

  it('should mark the content with the language and direction it is written in', async () => {
    const fixture = TestBed.createComponent(RenderedContent);
    fixture.componentRef.setInput('html', '<p>Text</p>');
    fixture.componentRef.setInput('language', { code: 'ar', nativeName: 'العربية', dir: 'rtl' });
    await fixture.whenStable();
    const container = (fixture.nativeElement as HTMLElement).querySelector('.rendered-content')!;
    expect([container.getAttribute('lang'), container.getAttribute('dir')]).toEqual(['ar', 'rtl']);
  });

  it('should leave lang and dir off when no language is given', async () => {
    const element = await render('<p>Text</p>');
    const container = element.querySelector('.rendered-content')!;
    expect(container.hasAttribute('lang')).toBe(false);
    expect(container.hasAttribute('dir')).toBe(false);
  });

  it('should update when the HTML changes', async () => {
    const fixture = TestBed.createComponent(RenderedContent);
    fixture.componentRef.setInput('html', '<p>First</p>');
    await fixture.whenStable();
    fixture.componentRef.setInput('html', '<p>Second</p>');
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Second');
  });

  describe('code blocks', () => {
    const CODE =
      '<pre class="code-block" dir="ltr"><code class="language-powershell">pnpm install\n</code></pre>';

    const setClipboard = (writeText: (text: string) => Promise<void>) =>
      Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    beforeEach(() => localStorage.clear());

    afterEach(() => {
      vi.useRealTimers();
      Reflect.deleteProperty(navigator, 'clipboard');
    });

    const button = (element: HTMLElement) =>
      element.querySelector<HTMLButtonElement>('button.copy-button')!;

    it('should add a bar with the language name and a copy button to each block', async () => {
      const element = await render(CODE + CODE);

      expect(element.querySelectorAll('.code-wrap')).toHaveLength(2);
      const wrap = element.querySelector('.code-wrap')!;
      expect(wrap.querySelector('.code-language')?.textContent).toBe('powershell');
      expect(wrap.querySelector('.code-wrap > pre')).toBeTruthy();
      expect(button(element).type).toBe('button');
      expect(button(element).textContent).toBe('Copy code');
    });

    it('should leave the language name empty when the block has none', async () => {
      const element = await render('<pre class="code-block"><code>ls</code></pre>');
      expect(element.querySelector('.code-language')?.textContent).toBe('');
    });

    it('should not wrap a block twice when the language changes', async () => {
      const fixture = TestBed.createComponent(RenderedContent);
      fixture.componentRef.setInput('html', CODE);
      await fixture.whenStable();
      TestBed.inject(I18nService).setLanguage('ar');
      await fixture.whenStable();

      const element = fixture.nativeElement as HTMLElement;
      expect(element.querySelectorAll('.code-wrap')).toHaveLength(1);
      expect(button(element).textContent).toBe('نسخ الشيفرة');
      expect(element.querySelector<HTMLElement>('.code-bar')?.dir).toBe('rtl');
    });

    it('should copy the code without the trailing newline and say so', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard(writeText);
      const fixture = TestBed.createComponent(RenderedContent);
      fixture.componentRef.setInput('html', CODE);
      await fixture.whenStable();
      const element = fixture.nativeElement as HTMLElement;

      button(element).click();
      await fixture.whenStable();

      expect(writeText).toHaveBeenCalledWith('pnpm install');
      expect(button(element).textContent).toBe('Copied');
      expect(element.querySelector('[role="status"]')?.textContent).toContain('copied');
    });

    it('should restore the button label after a moment', async () => {
      setClipboard(vi.fn().mockResolvedValue(undefined));
      const fixture = TestBed.createComponent(RenderedContent);
      fixture.componentRef.setInput('html', CODE);
      await fixture.whenStable();
      const element = fixture.nativeElement as HTMLElement;

      vi.useFakeTimers();
      button(element).click();
      await vi.advanceTimersByTimeAsync(0);
      expect(button(element).textContent).toBe('Copied');

      await vi.advanceTimersByTimeAsync(2000);
      expect(button(element).textContent).toBe('Copy code');
    });

    it('should select the code and report the failure when copying is not possible', async () => {
      setClipboard(vi.fn().mockRejectedValue(new Error('denied')));
      const fixture = TestBed.createComponent(RenderedContent);
      fixture.componentRef.setInput('html', CODE);
      await fixture.whenStable();
      const element = fixture.nativeElement as HTMLElement;

      button(element).click();
      await fixture.whenStable();

      expect(button(element).textContent).toBe('Copy code');
      expect(element.querySelector('[role="status"]')?.textContent).toContain('Ctrl+C');
      expect(window.getSelection()?.toString()).toContain('pnpm install');
    });

    it('should report a failure when the browser has no clipboard', async () => {
      const fixture = TestBed.createComponent(RenderedContent);
      fixture.componentRef.setInput('html', CODE);
      await fixture.whenStable();
      const element = fixture.nativeElement as HTMLElement;

      button(element).click();
      await fixture.whenStable();

      expect(element.querySelector('[role="status"]')?.textContent).toContain('Ctrl+C');
    });
  });
});
