import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
  padding: 10px 120px;
  background-color: #b89d82;
  position: fixed;
  top: 0;
  left: 300px; /* Đẩy header sang phải bằng chiều rộng của nav */
  width: calc(100% - 300px); /* Header chiếm phần còn lại của chiều rộng */
  z-index: 1000; /* Đảm bảo header nằm trên các thành phần khác */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Tạo hiệu ứng đổ bóng nếu cần */
`;
export const WrapperTextHeader = styled.span`
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  text-align: left;
`;
export const WrapperHeaderAccount = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  gap: 10px;
  font-size: 14px;
  cursor: pointer;
`;
export const MarqueeText = styled.div`
  white-space: nowrap;
  overflow: hidden;
  color: #fff;
  box-sizing: border-box;
  animation: marquee 10s linear infinite;

  @keyframes marquee {
    0% {
      transform: translateX(50%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;
// export const MainContent = styled.div`
//   margin-left: 300px; /* Bằng chiều rộng của nav */
//   padding: 20px; /* Thêm padding cho nội dung */
// `;
