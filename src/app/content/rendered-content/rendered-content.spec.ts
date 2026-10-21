import { TestBed } from '@angular/core/testing';
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
});
