import React from "react";
import logo from "../../img/logo2.png"; // Đường dẫn đến logo

const Logo = () => {
  return (
    <div style={styles.logoContainer}>
      <img src={logo} alt="Logo" style={styles.logo} />
    </div>
  );
};

const styles = {
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "60px", // Chiều rộng của logo
    height: "40px", // Chiều cao của logo
    borderRadius: "50%", // Bo tròn logo
    overflow: "hidden", // Ẩn phần dư thừa
  },
  logo: {
    width: "100%", // Để logo chiếm toàn bộ chiều rộng của container
    height: "auto", // Tự động điều chỉnh chiều cao
  },
};

export default Logo;
