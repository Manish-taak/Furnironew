"use client";
import React from "react";
import DragAndDrop from "../(dashboard)/dashboard/components/Dropgrag";
import DragDrop from "@/component/DragFiles";
import Testing from "../(dashboard)/dashboard/components/Testing";



const page = () => {
  return (
    <>
      <DragAndDrop />
      {/* <DragDrop /> */}
      <Testing/>

    </>
  );
};

export default page;