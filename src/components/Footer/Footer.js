import React, {Component} from 'react';

class Footer extends Component {
  render() {
    return (
      <footer className="app-footer">
        <span>Prince &copy; {new Date().getFullYear()}.</span>
        <span className="ml-auto">Sistemas - Cineplex</span>
      </footer>
    )
  }
}

export default Footer;
