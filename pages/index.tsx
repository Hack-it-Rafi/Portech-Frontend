// pages/index.tsx
import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/project-list");
  };

  return (
    <>
      <main>
        <div
          className="hero min-h-[600px] max-w-[1300px] mx-auto"
          style={{
            backgroundImage: `url("/port.jpg")`,
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-neutral-content text-center">
            <div className="max-w-md">
              <h1 className="mb-5 text-6xl font-semibold">
                Find Your Web3 Solution Here
              </h1>
              {/* <p className="mb-5">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p> */}
              <button onClick={handleNavigate} className="btn btn-success text-white">
                Go to Projects
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center h-[400px] my-10">
          <div className="flex-1 border-r-2 text-6xl border-[#59D05E] h-[400px] flex justify-center items-center">
            What We Offer
          </div>
          <div className="flex-1">
            <div className="px-10">
              <ul className="gap-10 list-disc text-2xl">
                <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum dignissimos at beatae, pariatur </li>
                <li className="my-5">ex soluta voluptatum ut amet suscipit esse in perspiciatis quis eaque facilis. Aut et nisi totam atque.</li>
                <li>ex soluta voluptatum ut amet suscipit esse in perspiciatis quis eaque facilis. Aut et nisi totam atque.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <footer className="footer footer-center bg-black text-white rounded p-10">
        <nav className="grid grid-flow-col gap-4">
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <div className="grid grid-flow-col gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </nav>
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by
            PORTECH Industries Ltd
          </p>
        </aside>
      </footer>
    </>
  );
};

export default HomePage;
