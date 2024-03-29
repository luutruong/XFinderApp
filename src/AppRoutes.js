import React from 'react'
import {createBottomTabNavigator, createStackNavigator, createAppContainer} from 'react-navigation'
import FinderScreen from "./screens/Finder/FinderScreen";
import Icon from 'react-native-vector-icons/Feather';
import EditFileScreen from "./screens/File/EditFileScreen";
import SettingScreen from "./screens/Setting/SettingScreen";
import ViewFileScreen from "./screens/File/ViewFileScreen";
import RecentFilesScreen from "./screens/File/RecentFilesScreen";

/* eslint-disable */
const mainRoutes = {
    Finder: {
        screens: {
            Finder: FinderScreen,
            EditFile: EditFileScreen,
            ViewFile: ViewFileScreen
        },
        navigationOptions: {
            tabBarLabel: 'Finder',
            tabBarIcon: ({ tintColor }) => <Icon name={'box'} color={tintColor} size={24}/>
        }
    },
    RecentFiles: {
        screens: {
            RecentFiles: RecentFilesScreen
        },
        navigationOptions: {
            tabBarLabel: 'Recent Files',
            tabBarIcon: ({ tintColor }) => <Icon name={'clock'} color={tintColor} size={24}/>
        }
    },
    Setting: {
        screens: {
            Setting: SettingScreen
        },
        navigationOptions: {
            tabBarLabel: 'Settings',
            tabBarIcon: ({ tintColor }) => <Icon name={'settings'} color={tintColor} size={24} />
        }
    }
};
/* eslint-enable */

const modalRoutes = {};

const dynamicRoutesMap = {};
Object.keys(mainRoutes).forEach((mainRouteKey) => {
    const groupedStackRoutes = createStackNavigator(
        {
            ...mainRoutes[mainRouteKey].screens
        },
        {
            navigationOptions: {
                headerStyle: {
                    borderBottomWidth: 0
                }
            }
        }
    );

    dynamicRoutesMap[mainRouteKey] = {
        screen: createStackNavigator(
            {
                [mainRouteKey]: groupedStackRoutes,
                ...modalRoutes
            },
            {
                initialRouteName: mainRouteKey,
                headerMode: 'none',
                mode: 'modal'
            }
        ),
        navigationOptions: ({ navigation }) => {
            return {
                ...mainRoutes[mainRouteKey].navigationOptions,
                tabBarVisible: navigation.state.index === 0
            };
        }
    };
});

const bottomStackNavigator = createBottomTabNavigator({
    ...dynamicRoutesMap
}, {
    initialRouteName: 'Finder',
    tabBarOptions: {
        showIcon: true,
        showLabel: true
    }
});

export const AppContainer = createAppContainer(bottomStackNavigator);