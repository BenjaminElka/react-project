import { Footer as FbFooter } from "flowbite-react";

const Footer = () => {
  return (
    <FbFooter container className="absolute  bg-slate-800">
      <div className="flex w-full justify-center">
        <FbFooter.Copyright
          href="#"
          by="Benjamin Elkabas"
          year={2024}
          className="text-slate-100"
        />
      </div>
    </FbFooter>
  );
};

export default Footer;
