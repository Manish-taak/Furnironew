"use client";
import React, { useState } from "react";
import Banner from "./home/Banner";
import BrowseRange from "./home/BrowseRange";
import FuniroFurniture from "./home/FuniroFurniture";
import OurProducts from "./home/OurProducts";
import Card from "@/component/ui/Card";
import Button from "@/component/ui/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/component/ui/Input";
import InputSelect from "@/component/ui/InputSelect";
import { Controller, useForm } from "react-hook-form";
import Benefits from "@/component/Benefits";
import TittleSection from "@/component/TittleSection";

const page = () => {

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [show, setshow] = useState(false);
  return (
    <>
      {/* <Banner /> */}
      {/* <BrowseRange /> */}
      {/* <FuniroFurniture /> */}
      {/* <Benefits /> */}
      {/* <OurProducts /> */}
      {/* <TittleSection /> */}
      {/* <Card /> */}
      {/* <Button
        icon={true}
        navroute="/productComparison"
        btntype="submit"
        varient="transparent"
        children="hello"
      /> */}
      {/* <Input type="number" placeholder="enter your name" label="Your name" />
      <Input
        show={true}
        setshow={setshow}
        placeholder="write your name"
        label="your name"
        type={`${show === true ? "text" : "password"}`}
        showtype={show}
      /> */}
      {/* <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <InputSelect
            {...field}
            label="Gender"
            placeholder="Western Province"
            value={field.value}
            onChange={field.onChange}
            options={[
              { id: 1, name: "Male" },
              { id: 2, name: "Female" },
              { id: 3, name: "Other" },
            ]}
          />
        )}
      /> */}
    </>
  );
};

export default page;