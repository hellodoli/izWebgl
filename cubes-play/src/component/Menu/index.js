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
          isDisabled: false,
          text: "Diamond",
          path: "/3d/diamond"
        },
        {
          key: 2,
          isDisabled: false,
          text: "Pyramid",
          path: "/3d/pyramid"
        },
        {
          key: 3,
          isDisabled: true,
          text: "3D Effect 03",
          path: "3d/fake03"
        },
        {
          key: 4,
          isDisabled: true,
          text: "3D Effect 04",
          path: "3d/fake04"
        }
      ]
    };
  }

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
