import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const useIsSmallBreakpoint = () => {
	const theme = useMantineTheme();
	return useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);
};

export default useIsSmallBreakpoint;
