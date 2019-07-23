import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import DishDetail from './DishdetailComponent';
import Header from './HeaderComponent';
import Home from './HomeComponent';
import About from './AboutComponent';
import Menu from './MenuComponent';
import Contact from './ContactComponent';
import Footer from './FooterComponent';
import { connect } from 'react-redux';
import { addComment } from '../redux/ActionCreators';

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}

const mapDispatchToprops = (dispatch) => ({
  addComment: (dishId, rating, author, comment) => dispatch(addComment(dishId, rating, author, comment))
});

class Main extends Component{

  // constructor(props){
  //   super(props);
    // this.state = {
      // dishes: DISHES,
      // comments: COMMENTS,
      // promotions: PROMOTIONS,
      // leaders: LEADERS
      // selectedDish: null
    // };
  // };

  // onDishSelect = (dishId) => {
  //   this.setState({
  //     selectedDish: dishId
  //   });
  // };

  render(){

    const HomePage = () => {
      return (
        <Home dish={ this.props.dishes.filter((dish) => dish.featured)[0] }
              promotion={ this.props.promotions.filter((promo) => promo.featured)[0] }
              leader={ this.props.leaders.filter((leader) => leader.featured)[0] } />
      );
    };

    const DishWithId = ({ match }) => {
      return (
        <DishDetail dish={ this.props.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0] }
            comments = { this.props.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId, 10)) }
            addComment = { this.props.addComment }
         />
      )
    }

    return (
      <div>
        <Header />
        <Switch>
          <Route path="/home" component={ HomePage } />
          <Route exact path="/menu" component={ () => <Menu dishes={ this.props.dishes } /> } />
          <Route path="/menu/:dishId" component={ DishWithId } />
          <Route exact path="/aboutus" component={ () => <About leaders={ this.props.leaders } /> } />
          <Route exact path="/contactus" component={ Contact } />
          <Redirect to="/home" />
        </Switch>
        {
          // <Menu
          //   dishes={ this.props.dishes }
          //   onClick={(dishId) => this.onDishSelect(dishId)} />
          // <DishDetail
        //   dish={ this.props.dishes.filter((dish) => dish.id === this.props.selectedDish )[0] } />
      }
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToprops)(Main));
