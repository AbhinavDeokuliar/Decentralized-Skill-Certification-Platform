import React, { useState } from 'react';

function CertificationForm({ contract }) {
  const [recipient, setRecipient] = useState('');
  const [skill, setSkill] = useState('');
  const [level, setLevel] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.issueCertification(recipient, skill, level);
      await tx.wait();
      alert('Certification issued successfully!');
      setRecipient('');
      setSkill('');
      setLevel('');
    } catch (error) {
      console.error('Error issuing certification:', error);
      alert('Error issuing certification');
    }
  };

  return (
    <div className="certification-form">
      <h2>Issue New Certification</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="text"
          placeholder="Skill"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
        <input
          type="text"
          placeholder="Level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />
        <button type="submit">Issue Certification</button>
      </form>
    </div>
  );
}

export default CertificationForm;
