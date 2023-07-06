import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Easing,
    View
} from 'react-native';
import { useTheme } from 'react-native-paper';
import isArray from 'lodash/isArray';
import forEach from 'lodash/forEach';
import assign from 'lodash/assign';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const AnimatedSkeleton = ({
    width,
    height,
    style
}) => {
    const theme = useTheme();
    const animated = useRef(new Animated.Value(0));

    useEffect(() => {
        Animated.loop(
            Animated.timing(
                animated.current,
                {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear.inOut,
                    useNativeDriver: true
                }
            )
        ).start();
    }, []);

    const translateX = animated.current.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width]
    });

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

    return (
        <View
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
            <AnimatedLinearGradient
                colors={[
                    theme.colors.skeletonDark,
                    theme.colors.skeletonLight,
                    theme.colors.skeletonLight,
                    theme.colors.skeletonDark
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                // eslint-disable-next-line react/forbid-component-props
                style={{
                    ...StyleSheet.absoluteFill,
                    transform: [{ translateX }]
                }}
            />
        </View>
    );
};
