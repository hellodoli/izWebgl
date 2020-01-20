import React, { Component } from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import { NavLink } from "react-router-dom";

class Menu extends Component {
  constructor() {
    super();
    this.state = {
      menu: [
        { key: 0, text: "Home", path: "/" },
        {
          key: 1,
          isDisabled: true,
          text: "3D Effect 01",
          path: "/3d/fake01"
        },
        {
          key: 2,
          isDisabled: true,
          text: "3D Effect 02",
          path: "/3d/fake02"
        },
        {
          key: 3,
          isDisabled: true,
          text: "3D Effect 03",
          path: "/3d/fake03"
        },
        {
          key: 4,
          isDisabled: false,
          text: "Pyramid",
          path: "/3d/pyramid"
        },
        {
          key: 5,
          isDisabled: true,
          text: "3D Effect 05",
          path: "3d/fake05"
        },
        {
          key: 6,
          isDisabled: true,
          text: "3D Effect 06",
          path: "3d/fake06"
        }
      ]
    };
  }

  onClickItem = index => {};

  render() {
    const { menu } = this.state;
    return (
      <div className="play-app-menu">
        <ListGroup>
          {menu.length > 0 &&
            menu.map(item => (
              <ListGroupItem
                key={item.key}
                tag={NavLink}
                exact={item.path === "/" ? true : false}
                to={item.path}
                disabled={item.isDisabled ? true : false}
                activeClassName="active"
              >
                {item.text}
              </ListGroupItem>
            ))}
        </ListGroup>
      </div>
    );
  }
}

export default Menu;
