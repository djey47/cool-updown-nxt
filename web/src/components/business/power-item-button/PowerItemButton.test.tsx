import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import PowerItemButton from './PowerItemButton';
import Button from '../../atoms/button/Button';

type ButtonProps = React.ComponentProps<typeof Button>;

jest.mock('../../atoms/button/Button', () => {
  // Simple Button mock that renders a real <button> so we can interact with it in tests
  return {
    __esModule: true,
    default: ({ children, onClick, isClickable }: ButtonProps) => (
      <button onClick={onClick} data-isclickable={isClickable}>
        {children}
      </button>
    ),
  };
});

const onPowerActionMock = jest.fn();

describe('PowerItemButton', () => {
  const findIcon = (container: HTMLElement) =>
    container.querySelector('svg.device-power-cta') as SVGElement | null;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('applies "is-on" when devicePowerState is "on" and no operation is running', () => {
    // given-when
    const { container } = render(
      <PowerItemButton
        onPowerAction={onPowerActionMock}
        isPerformingPowerOperation={false}
        devicePowerState={'on'}
      />
    );

    // then
    const icon = findIcon(container);
    expect(icon).not.toBeNull();
    expect(icon!.classList.contains('is-on')).toBe(true);
    expect(icon!.classList.contains('is-off')).toBe(false);
    expect(icon!.classList.contains('animate-pulse')).toBe(false);
  });

  it('inverts state and applies "is-off" and "animate-pulse" when performing and device was "on"', () => {
    // given-when
    const { container } = render(
      <PowerItemButton
        onPowerAction={onPowerActionMock}
        isPerformingPowerOperation={true}
        devicePowerState={'on'}
      />
    );

    // then
    const icon = findIcon(container);
    expect(icon).not.toBeNull();
    // effectivePowerState should be 'off' when performing and device was 'on'
    expect(icon!.classList.contains('is-off')).toBe(true);
    expect(icon!.classList.contains('is-on')).toBe(false);
    expect(icon!.classList.contains('animate-pulse')).toBe(true);
  });

  it('handles "n/a" and applies "is-na" and "text-indigo-900" (and still shows animate-pulse when performing)', () => {
    // given
    const { container } = render(
      <PowerItemButton
        onPowerAction={onPowerActionMock}
        isPerformingPowerOperation={true}
        devicePowerState={'n/a'}
      />
    );

    // when-then
    const icon = findIcon(container);
    expect(icon).not.toBeNull();
    expect(icon!.classList.contains('is-na')).toBe(true);
    expect(icon!.classList.contains('text-indigo-900')).toBe(true);
    expect(icon!.classList.contains('animate-pulse')).toBe(true);
    // should not have is-on/is-off for 'n/a'
    expect(icon!.classList.contains('is-on')).toBe(false);
    expect(icon!.classList.contains('is-off')).toBe(false);
  });

  it('calls onPowerAction when isClickable=true and button is clicked', () => {
    // given-when
    const { getByRole } = render(
      <PowerItemButton
        onPowerAction={onPowerActionMock}
        isPerformingPowerOperation={false}
        devicePowerState={'off'}
        isClickable={true}
      />
    );

    // then
    const button = getByRole('button');
    fireEvent.click(button);
    expect(onPowerActionMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPowerAction when isClickable=false', () => {
    // given-when
    const { getByRole } = render(
      <PowerItemButton
        onPowerAction={onPowerActionMock}
        isPerformingPowerOperation={false}
        devicePowerState={'off'}
        isClickable={false}
      />
    );

    // then
    const button = getByRole('button');
    fireEvent.click(button);
    expect(onPowerActionMock).not.toHaveBeenCalled();
  });
});
