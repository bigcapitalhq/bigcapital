import { FlexStyled } from './Flex.style';
import { FlexItem } from './FlexItem';
import { FlexProps } from './interfaces';

export function Flex({
  children,
  col = 12,
  gap,
  align,
  className,
  style,
}: FlexProps) {
  return (
    <FlexStyled
      col={col}
      gap={gap}
      align={align}
      className={className}
      style={style}
    >
      {children}
      <FlexItem col={col} gap={gap} />
    </FlexStyled>
  );
}
