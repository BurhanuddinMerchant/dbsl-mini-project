import React, { useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./index.css";
import { Typography } from "antd";
import { Link } from "react-router-dom";

var axios = require("axios");

const { Title } = Typography;

const Login = () => {
  const [next, setNext] = useState("/user-dashboard");
  const onFinish = (values) => {
    let data = JSON.stringify({
      username: values.username,
      password: values.password,
    });
    var config = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
      url: `${process.env.REACT_APP_SERVER_URL}api/login`,
    };

    axios(config)
      .then(async (response) => {
        await sessionStorage.setItem("access_token", response.data.token);
        window.location.href = values.isNurse
          ? "/nurse-dashboard"
          : "/user-dashboard";
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div class="card-holder">
      <div className="card">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item>
            <Title level={2}>Login </Title>
          </Form.Item>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item name="isNurse" valuePropName="checked" noStyle>
            <Checkbox>Are you a nurse?</Checkbox>
          </Form.Item>

          <br />
          <br />

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form.Item>

          <Link to="/user-registration">Register here!</Link>
        </Form>
      </div>
    </div>
  );
};

export default Login;
