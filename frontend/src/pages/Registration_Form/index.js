import React, { useState } from "react";
import { Form, Input, Select, Button } from "antd";
import "./index.css";
import { Typography } from "antd";

const { Option } = Select;
const { Title } = Typography;

const RegistrationForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    var axios = require("axios");
    var data = JSON.stringify({
      fname: values.fname,
      lname: values.lname,
      pincode: values.pincode,
      gender: values.gender,
      phoneNumber: values.phone,
      email: values.email,
      password: values.password,
      address: values.address,
      age: values.age,
    });
    var config = {
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}api/register/user`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(async (response) => {
        await sessionStorage.setItem("access_token", response.data.data.token);
        window.location.href = "/user-dashboard";
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="86">+91</Option>
        <Option value="87">+92</Option>
        <Option value="87">+44</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div className="card-holder">
      <div className="card">
        <Form
          //   {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            residence: ["zhejiang", "hangzhou", "xihu"],
            prefix: "86",
          }}
          scrollToFirstError
        >
          <Form.Item labelCol={16}>
            <Title level={2}>Registration Form </Title>
          </Form.Item>
          <Form.Item
            name="fname"
            label="First Name"
            rules={[
              {
                required: true,
                message: "Please input your First Name!",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lname"
            label="Last Name"
            rules={[
              {
                required: true,
                message: "Please input your Last Name!",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            tooltip="This email-id will be helpful for logging in"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="pincode"
            label="Pincode"
            rules={[
              {
                required: true,
                message: "Please select your pincode!",
              },
            ]}
          >
            <Input type="number"></Input>
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[
              {
                required: true,
                message: "Please select your age!",
              },
            ]}
          >
            <Input type="number"></Input>
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
            ]}
          >
            <Input
              addonBefore={prefixSelector}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[
              {
                required: true,
                message: "Please input your address!",
              },
            ]}
          >
            <Input
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[
              {
                required: true,
                message: "Please select gender!",
              },
            ]}
          >
            <Select placeholder="select your gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Others">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default RegistrationForm;
