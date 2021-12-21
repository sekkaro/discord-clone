import { useRouter } from "next/router";

const Channel = () => {
  const router = useRouter();

  return <div>this is channel : {router.query.id} page</div>;
};

export default Channel;
