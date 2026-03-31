import React, { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";

const Searchbox = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!username.trim()) return;

    setLoading(true);

    setTimeout(() => {
      navigate(`/profile/${username}`);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 ">
      
      {/* Heading */}
      <p className="text-center text-sm text-muted-foreground mb-4">
        Search any GitHub developer
      </p>

      <div className="relative group">
        
        <InputGroup className="transition-all duration-300 group-focus-within:scale-[1.02]">
          
          <InputGroupInput
            placeholder="Enter GitHub username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="text-base"
          />

          <InputGroupAddon align="inline-end">
            {loading ? (
              <Spinner className="mr-2" />
            ) : (
              <InputGroupButton
                variant="default"
                onClick={handleSearch}
                className="transition hover:opacity-90"
              >
                Search
              </InputGroupButton>
            )}
          </InputGroupAddon>

        </InputGroup>

        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 opacity-0 group-focus-within:opacity-100 transition duration-300 bg-gradient-to-r from-purple-500/20 to-amber-500/20 blur-xl rounded-xl"></div>

      </div>
    </div>
  );
};

export default Searchbox;