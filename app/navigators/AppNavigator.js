import React from 'react';
import PropTypes from 'prop-types';
import {BackHandler} from 'react-native';
import {addNavigationHelpers, StackNavigator, NavigationActions} from "react-navigation";
import HomeScreen from "../screens/HomeScreen";
import DocScreen from "../screens/DocScreen";
import SectionScreen from "../screens/SectionScreen";
import ArticleScreen from "../screens/ArticleScreen";
import SearchScreen from "../screens/SearchScreen";
import {connect} from "react-redux";

export const AppNavigator = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  DocDetails: {
    screen: DocScreen
  },
  SectionDetails: {
    screen: SectionScreen
  },
  Article: {
    screen: ArticleScreen
  },
  Search: {
    screen: SearchScreen
  }
});

class AppWithNavigationState extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    const {dispatch, nav} = this.props;
    return (
      <AppNavigator navigation={addNavigationHelpers({dispatch, state: nav})}/>
    );
  }
}


const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
