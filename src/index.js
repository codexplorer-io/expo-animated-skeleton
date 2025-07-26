import React, { useEffect, useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import isArray from 'lodash/isArray';
import forEach from 'lodash/forEach';
import assign from 'lodash/assign';
import {
    Canvas,
    Fill,
    interpolateColors,
    LinearGradient,
    vec
} from '@shopify/react-native-skia';
import {
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

export const AnimatedSkeleton = ({
    width,
    height,
    style
}) => {
    const theme = useTheme();

    const viewStyles = {};
    const extractViewStyles = ({
        // Ignore styles
        alignSelf,
        flex,
        flexBasis,
        flexGrow,
        flexShrink,
        margin,
        marginLeft,
        marginTop,
        marginRight,
        marginBottom,
        padding,
        paddingLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        ...styles
    }) => {
        assign(
            viewStyles,
            styles
        );
    };

    if (isArray(style)) {
        forEach(style, extractViewStyles);
    } else if (style) {
        extractViewStyles(style);
    }

    const startColors = useMemo(() => [
        theme.colors.skeletonLight,
        theme.colors.skeletonDark,
        theme.colors.skeletonDark,
        theme.colors.skeletonLight
    ], [theme.colors.skeletonLight, theme.colors.skeletonDark]);
    const endColors = useMemo(() => [
        theme.colors.skeletonDark,
        theme.colors.skeletonLight,
        theme.colors.skeletonLight,
        theme.colors.skeletonDark
    ], [theme.colors.skeletonLight, theme.colors.skeletonDark]);

    const colorsIndex = useSharedValue(0);
    useEffect(() => {
        colorsIndex.value = withRepeat(
            withTiming(startColors.length - 1, {
                duration: 2000
            }),
            -1,
            true
        );
    }, [colorsIndex, startColors.length]);
    const gradientColors = useDerivedValue(() => [
        interpolateColors(colorsIndex.value, [0, 1, 2, 3], startColors),
        interpolateColors(colorsIndex.value, [0, 1, 2, 3], endColors)
    ]);

    return (
        <Canvas
            // eslint-disable-next-line react/forbid-component-props
            style={[
                viewStyles,
                {
                    overflow: 'hidden',
                    backgroundColor: theme.colors.skeletonDark,
                    borderColor: theme.colors.skeletonLight,
                    width,
                    height
                }
            ]}
            width={width}
            height={height}
        >
            <Fill>
                <LinearGradient
                    colors={gradientColors ?? [
                        theme.colors.skeletonDark,
                        theme.colors.skeletonLight,
                        theme.colors.skeletonLight,
                        theme.colors.skeletonDark
                    ]}
                    start={vec(0, 0)}
                    end={vec(width, 0)}
                />
            </Fill>
        </Canvas>
    );
};
