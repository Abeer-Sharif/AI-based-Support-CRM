import {
  useEffect,
  useMemo,
  useState
} from "react";

import Navbar from "../components/Navbar.jsx";
import { userApi } from "../services/userApi.js";

import "./Ticket.css";

const TEAMS = [
  "General",
  "Billing",
  "Technical",
  "Account",
  "Shipping",
  "Product"
];

export default function Agents() {
  // All agents from backend
  const [agents, setAgents] = useState([]);

  // Search and team filtering
  const [search, setSearch] = useState("");
  const [filterTeam, setFilterTeam] = useState("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Stores ID of the agent currently being updated
  const [savingAgentId, setSavingAgentId] =
    useState(null);


  // ==================================================
  // LOAD AGENTS
  // ==================================================

  const loadAgents = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await userApi.getAgents();

      setAgents(data);

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };


  // Load agents when page first opens
  useEffect(() => {
    loadAgents();
  }, []);


  // ==================================================
  // CHANGE TEAM IN REACT STATE
  // ==================================================

  const handleTeamChange = (
    agentId,
    newTeam
  ) => {
    setAgents((currentAgents) =>
      currentAgents.map((agent) => {
        if (agent._id === agentId) {
          return {
            ...agent,
            team: newTeam
          };
        }

        return agent;
      })
    );
  };


  // ==================================================
  // SAVE NEW TEAM TO BACKEND
  // ==================================================

  const handleUpdate = async (agent) => {
    setSavingAgentId(agent._id);

    setError("");
    setMessage("");

    try {
      await userApi.updateUser(
        agent.name,
        {
          team: agent.team
        }
      );

      setMessage(
        `${agent.name}'s team updated to ${agent.team}`
      );

      // Reload data from MongoDB
      await loadAgents();

    } catch (err) {
      setError(err.message);

    } finally {
      setSavingAgentId(null);
    }
  };


  // ==================================================
  // SEARCH + FILTER
  // ==================================================

  const filteredAgents = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return agents.filter((agent) => {
      const matchesSearch =
        !searchValue ||
        agent.name
          ?.toLowerCase()
          .includes(searchValue) ||
        agent.email
          ?.toLowerCase()
          .includes(searchValue);

      const matchesTeam =
        !filterTeam ||
        agent.team === filterTeam;

      return matchesSearch && matchesTeam;
    });

  }, [agents, search, filterTeam]);


  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="crm-shell page-only">

      <Navbar />

      <main className="workspace-main agents-workspace">

        {/* HEADER */}

        <header className="workspace-topbar">

          <div>
            <p className="section-eyebrow">
              Administration
            </p>

            <h1>Agents</h1>
          </div>


          <button
            type="button"
            className="secondary-button"
            onClick={loadAgents}
          >
            Refresh
          </button>

        </header>


        {/* SUMMARY */}

        <section className="agents-summary">

          <article>
            <span>
              Total agents
            </span>

            <strong>
              {agents.length}
            </strong>
          </article>


          <article>
            <span>
              Current team
            </span>

            <strong>
              {filterTeam || "All"}
            </strong>
          </article>

        </section>


        {/* ERROR */}

        {error && (
          <div className="inline-alert">
            {error}
          </div>
        )}


        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="success-alert">
            {message}
          </div>
        )}


        {/* AGENT TABLE */}

        <section className="ticket-panel">

          {/* SEARCH + FILTER */}

          <div className="agents-toolbar">

            <input
              type="search"
              className="search-input agents-search"
              placeholder="Search agents..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />


            <select
              className="status-select"
              value={filterTeam}
              onChange={(event) =>
                setFilterTeam(
                  event.target.value
                )
              }
            >

              <option value="">
                All teams
              </option>

              {TEAMS.map((team) => (
                <option
                  key={team}
                  value={team}
                >
                  {team}
                </option>
              ))}

            </select>

          </div>


          {/* LOADING */}

          {loading && (
            <div className="table-state">

              <div className="spinner" />

              <p>
                Loading agents...
              </p>

            </div>
          )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            filteredAgents.length === 0 && (

              <div className="table-state">
                <strong>
                  No agents found
                </strong>

                <p>
                  Try changing the search or team filter.
                </p>
              </div>

            )}


          {/* AGENTS */}

          {!loading &&
            !error &&
            filteredAgents.length > 0 && (

              <div className="ticket-table-wrap">

                <table className="ticket-table agents-table">

                  <thead>
                    <tr>
                      <th>Agent</th>
                      <th>Email</th>
                      <th>Team</th>
                      <th>Action</th>
                    </tr>
                  </thead>


                  <tbody>

                    {filteredAgents.map((agent) => (

                      <tr key={agent._id}>


                        {/* AGENT NAME */}

                        <td data-label="Agent">

                          <div className="agent-name-cell">

                            <div className="agent-avatar">
                              {agent.name
                                ?.charAt(0)
                                .toUpperCase() ||
                                "A"}
                            </div>

                            <strong>
                              {agent.name}
                            </strong>

                          </div>

                        </td>


                        {/* EMAIL */}

                        <td data-label="Email">
                          {agent.email}
                        </td>


                        {/* TEAM */}

                        <td data-label="Team">

                          <select
                            className="agent-team-select"

                            value={
                              agent.team ||
                              "General"
                            }

                            onChange={(event) =>
                              handleTeamChange(
                                agent._id,
                                event.target.value
                              )
                            }
                          >

                            {TEAMS.map((team) => (
                              <option
                                key={team}
                                value={team}
                              >
                                {team}
                              </option>
                            ))}

                          </select>

                        </td>


                        {/* UPDATE */}

                        <td data-label="Action">

                          <button
                            type="button"

                            className="
                              primary-button
                              agent-update-button
                            "

                            onClick={() =>
                              handleUpdate(agent)
                            }

                            disabled={
                              savingAgentId ===
                              agent._id
                            }
                          >

                            {savingAgentId === agent._id
                              ? "Saving..."
                              : "Update"}

                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

        </section>

      </main>

    </div>
  );
}