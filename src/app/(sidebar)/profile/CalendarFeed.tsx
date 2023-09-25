"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner";
import { graphql } from "@/gql";
import { cn, getBaseURL } from "@/lib/utils";
import { MdRefresh } from "react-icons/md";
import { useMutation, useQuery } from "urql";

const GetApiTokenQuery = graphql(`
  query getApiToken {
    me {
      id
      apiToken {
        id
      }
    }
  }
`);

const RerollTokenMutation = graphql(`
  mutation rerollApiToken($id: String!) {
    rerollApiToken(id: $id) {
      id
    }
  }
`);

export const CalendarFeed = () => {
  const [{ data, fetching }] = useQuery({ query: GetApiTokenQuery });
  const apiToken = data?.me?.apiToken;

  const [rotateStatus, rotate] = useMutation(RerollTokenMutation);

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        readOnly
        disabled={fetching}
        value={
          fetching
            ? "Loading..."
            : getBaseURL() + "/api/calendar/" + apiToken?.id
        }
        onClick={(e) => e.currentTarget.select()}
      />
      <Button
        variant="secondary"
        title="Get a new link"
        onClick={() => rotate({ id: apiToken!.id })}
        disabled={fetching || rotateStatus.fetching}
      >
        {fetching ? (
          <Spinner />
        ) : (
          <MdRefresh className={cn(rotateStatus.fetching && "animate-spin")} />
        )}
      </Button>
    </div>
  );
};
