import { Meta, StoryObj } from "@storybook/react";
import Component from "./Component";

const meta: Meta<typeof Component> = {
  title: "Components/Component",
  component: Component,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    prop: {
      control: "text",
      description: "Component prop description",
    },
    onAction: {
      action: "clicked",
      description: "Action callback",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    prop: "Default value",
  },
};

export const WithAction: Story = {
  args: {
    prop: "With action",
    onAction: () => console.log("Action triggered"),
  },
};

export const CustomClass: Story = {
  args: {
    prop: "Custom class",
    className: "custom-component",
  },
};
